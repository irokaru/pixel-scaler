import { GIFEncoder, quantize, applyPalette, type Format } from "gifenc";
import { parseGIF, decompressFrames, type ParsedFrame } from "gifuct-js";

import { InputError } from "@/core/models/errors/InputError";
import type { GifFrame } from "@/core/types/gif";

export const hasTransparentPixels = (data: Uint8ClampedArray): boolean => {
  for (let index = 3; index < data.length; index += 4) {
    if (data[index] < 255) return true;
  }
  return false;
};

export const countUniqueColors = (data: Uint8ClampedArray): number => {
  const uint32 = new Uint32Array(
    data.buffer,
    data.byteOffset,
    data.byteLength / 4,
  );
  const colors = new Set(uint32);
  return Math.max(2, Math.min(colors.size, 256));
};

export const isAnimatedGif = async (file: File): Promise<boolean> => {
  const buffer = await file.arrayBuffer();
  const gif = parseGIF(buffer);
  const frames = decompressFrames(gif, false);
  return frames.length > 1;
};

export const decodeGifFrames = async (
  file: File,
): Promise<{ frames: GifFrame[]; width: number; height: number }> => {
  const buffer = await file.arrayBuffer();
  const gif = parseGIF(buffer);
  const rawFrames = decompressFrames(gif, true);

  if (rawFrames.length === 0) {
    throw new InputError("encoding-error", { filename: file.name });
  }

  const { width, height } = gif.lsd;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d")!;

  let previousCanvasState: ImageData | undefined;
  let previousFrameDims: ParsedFrame["dims"] | undefined;
  let previousDisposalType = 0;

  const frames: GifFrame[] = rawFrames.map((frame) => {
    if (previousDisposalType === 3 && previousCanvasState) {
      context.putImageData(previousCanvasState, 0, 0);
    } else if (previousDisposalType === 2 && previousFrameDims) {
      context.clearRect(
        previousFrameDims.left,
        previousFrameDims.top,
        previousFrameDims.width,
        previousFrameDims.height,
      );
    }

    if (frame.disposalType === 3) {
      previousCanvasState = context.getImageData(0, 0, width, height);
    }

    const patchImageData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frame.dims.width,
      frame.dims.height,
    );
    const temporaryCanvas = document.createElement("canvas");
    temporaryCanvas.width = frame.dims.width;
    temporaryCanvas.height = frame.dims.height;
    const temporaryContext = temporaryCanvas.getContext("2d")!;
    temporaryContext.putImageData(patchImageData, 0, 0);
    context.drawImage(temporaryCanvas, frame.dims.left, frame.dims.top);

    previousDisposalType = frame.disposalType;
    previousFrameDims = frame.dims;

    return {
      imageData: context.getImageData(0, 0, width, height),
      delay: frame.delay ?? 100,
    };
  });

  return { frames, width, height };
};

const colorDistanceSquared = (
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
): number => {
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
};

const shouldClear = (current: ImageData, previous: ImageData): boolean => {
  const currentData = current.data;
  const previousData = previous.data;
  for (let index = 0; index < currentData.length; index += 4) {
    if (currentData[index + 3] < 128 && previousData[index + 3] >= 128) {
      return true;
    }
  }
  return false;
};

const createDiffFrame = (
  current: ImageData,
  previous: ImageData,
  thresholdSq = 16,
): ImageData => {
  const { width, height } = current;
  const currentData = current.data;
  const previousData = previous.data;

  const diffData = new Uint8ClampedArray(currentData);

  for (let index = 0; index < currentData.length; index += 4) {
    const [r1, g1, b1, a1] = pickColors(currentData, index);
    const [r2, g2, b2, a2] = pickColors(previousData, index);

    // If both are transparent, they are identical
    if (a1 < 128 && a2 < 128) {
      diffData[index] = 0;
      diffData[index + 1] = 0;
      diffData[index + 2] = 0;
      diffData[index + 3] = 0;
      continue;
    }

    // Compare colors with a threshold to account for scaling interpolation differences
    if (
      a1 >= 128 &&
      a2 >= 128 &&
      colorDistanceSquared(r1, g1, b1, r2, g2, b2) <= thresholdSq
    ) {
      // Pixel is visually unchanged, make it transparent in the diff
      diffData[index] = 0;
      diffData[index + 1] = 0;
      diffData[index + 2] = 0;
      diffData[index + 3] = 0;
    } else {
      // Ensure binary alpha for the output diff frame
      if (a1 < 128) {
        diffData[index] = 0;
        diffData[index + 1] = 0;
        diffData[index + 2] = 0;
        diffData[index + 3] = 0;
      } else {
        diffData[index + 3] = 255;
      }
    }
  }

  return new ImageData(diffData, width, height);
};

const pickColors = (
  imageDataArray: ImageData["data"],
  offset: number,
): [number, number, number, number] => {
  return [
    imageDataArray[offset],
    imageDataArray[offset + 1],
    imageDataArray[offset + 2],
    imageDataArray[offset + 3],
  ];
};

export const encodeAsGif = (frames: GifFrame[], filename: string): File => {
  if (frames.length === 0) {
    throw new InputError("encoding-error", { filename });
  }

  const encoder = GIFEncoder();
  const format: Format = "rgba4444"; // Use rgba4444 for transparency support

  // Determine frame diffing and disposal strategies to avoid ghosting
  const encodedFramesInfo = frames.map((_, index) => ({
    isDiff: index > 0,
    dispose: 1, // Default: Do not dispose
  }));

  encodedFramesInfo[0].isDiff = false;

  for (let index = 0; index < frames.length; index++) {
    const nextI = (index + 1) % frames.length;
    if (!shouldClear(frames[nextI].imageData, frames[index].imageData)) {
      continue;
    }

    encodedFramesInfo[index].dispose = 2; // Restore to background color
    encodedFramesInfo[nextI].isDiff = false; // Next frame must be a full frame
  }

  const totalPixels = frames[0].imageData.data.length / 4;
  const pixelsToSample = Math.min(totalPixels * frames.length, 1_000_000);
  const sampleStride = Math.max(
    1,
    Math.floor((totalPixels * frames.length) / pixelsToSample),
  );

  const sampledData = new Uint8ClampedArray(
    Math.floor((totalPixels * frames.length) / sampleStride) * 4,
  );

  let sampleIndex = 0;
  for (const frame of frames) {
    const data = frame.imageData.data;
    for (let index = 0; index < data.length; index += 4 * sampleStride) {
      if (!(sampleIndex < sampledData.length)) {
        continue;
      }

      if (data[index + 3] < 128) {
        sampledData[sampleIndex] = 0;
        sampledData[sampleIndex + 1] = 0;
        sampledData[sampleIndex + 2] = 0;
        sampledData[sampleIndex + 3] = 0;
      } else {
        sampledData[sampleIndex] = data[index];
        sampledData[sampleIndex + 1] = data[index + 1];
        sampledData[sampleIndex + 2] = data[index + 2];
        sampledData[sampleIndex + 3] = 255;
      }
      sampleIndex += 4;
    }
  }

  const maxColors = countUniqueColors(sampledData.slice(0, sampleIndex));
  const globalPalette = quantize(sampledData.slice(0, sampleIndex), maxColors, {
    format,
  });

  // Ensure we have a fully transparent color in the palette if needed
  let transparentIndex = globalPalette.findIndex((c) => c[3] === 0);
  if (transparentIndex === -1 && globalPalette.length < 256) {
    globalPalette.push([0, 0, 0, 0]);
    transparentIndex = globalPalette.length - 1;
  } else if (transparentIndex === -1) {
    globalPalette[255] = [0, 0, 0, 0];
    transparentIndex = 255;
  }

  // Force transparent color to be at index 0 to avoid background color issues with dispose 2
  if (transparentIndex !== 0) {
    const temporary = globalPalette[0];
    globalPalette[0] = globalPalette[transparentIndex];
    globalPalette[transparentIndex] = temporary;
    transparentIndex = 0;
  }

  for (const [index_, frame] of frames.entries()) {
    const { width, height } = frame.imageData;
    const info = encodedFramesInfo[index_];
    let frameToEncode: ImageData;

    if (info.isDiff) {
      frameToEncode = createDiffFrame(
        frame.imageData,
        frames[index_ - 1].imageData,
        16, // Threshold for color distance squared
      );
    } else {
      // Even if not a diff frame, enforce binary alpha for clean palette mapping
      const data = new Uint8ClampedArray(frame.imageData.data);
      for (let index__ = 0; index__ < data.length; index__ += 4) {
        if (data[index__ + 3] < 128) {
          data[index__] = 0;
          data[index__ + 1] = 0;
          data[index__ + 2] = 0;
          data[index__ + 3] = 0;
        } else {
          data[index__ + 3] = 255;
        }
      }
      frameToEncode = new ImageData(data, width, height);
    }

    const index = applyPalette(frameToEncode.data, globalPalette, format);

    encoder.writeFrame(index, width, height, {
      ...(index_ === 0 && { palette: globalPalette, repeat: 0 }),
      transparent: true,
      transparentIndex,
      delay: frame.delay,
      dispose: info.dispose,
    });
  }

  encoder.finish();
  return new File([encoder.bytes() as Uint8Array<ArrayBuffer>], filename, {
    type: "image/gif",
  });
};
