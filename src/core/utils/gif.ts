import { GIFEncoder, quantize, applyPalette, type Format } from "gifenc";
import { parseGIF, decompressFrames, type ParsedFrame } from "gifuct-js";

import { InputError } from "@/core/models/errors/InputError";
import type { GifFrame } from "@/core/types/gif";

export const hasTransparentPixels = (data: Uint8ClampedArray): boolean => {
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
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
  const ctx = canvas.getContext("2d")!;

  let previousCanvasState: ImageData | undefined;
  let previousFrameDims: ParsedFrame["dims"] | undefined;
  let previousDisposalType = 0;

  const frames: GifFrame[] = rawFrames.map((frame) => {
    if (previousDisposalType === 3 && previousCanvasState) {
      ctx.putImageData(previousCanvasState, 0, 0);
    } else if (previousDisposalType === 2 && previousFrameDims) {
      ctx.clearRect(
        previousFrameDims.left,
        previousFrameDims.top,
        previousFrameDims.width,
        previousFrameDims.height,
      );
    }

    if (frame.disposalType === 3) {
      previousCanvasState = ctx.getImageData(0, 0, width, height);
    }

    const patchImageData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frame.dims.width,
      frame.dims.height,
    );
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = frame.dims.width;
    tempCanvas.height = frame.dims.height;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.putImageData(patchImageData, 0, 0);
    ctx.drawImage(tempCanvas, frame.dims.left, frame.dims.top);

    previousDisposalType = frame.disposalType;
    previousFrameDims = frame.dims;

    return {
      imageData: ctx.getImageData(0, 0, width, height),
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

const needsClear = (current: ImageData, previous: ImageData): boolean => {
  const currentData = current.data;
  const previousData = previous.data;
  for (let i = 0; i < currentData.length; i += 4) {
    if (currentData[i + 3] < 128 && previousData[i + 3] >= 128) {
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

  for (let i = 0; i < currentData.length; i += 4) {
    const [r1, g1, b1, a1] = pickColors(currentData, i);
    const [r2, g2, b2, a2] = pickColors(previousData, i);

    // If both are transparent, they are identical
    if (a1 < 128 && a2 < 128) {
      diffData[i] = 0;
      diffData[i + 1] = 0;
      diffData[i + 2] = 0;
      diffData[i + 3] = 0;
      continue;
    }

    // Compare colors with a threshold to account for scaling interpolation differences
    if (
      a1 >= 128 &&
      a2 >= 128 &&
      colorDistanceSquared(r1, g1, b1, r2, g2, b2) <= thresholdSq
    ) {
      // Pixel is visually unchanged, make it transparent in the diff
      diffData[i] = 0;
      diffData[i + 1] = 0;
      diffData[i + 2] = 0;
      diffData[i + 3] = 0;
    } else {
      // Ensure binary alpha for the output diff frame
      if (a1 < 128) {
        diffData[i] = 0;
        diffData[i + 1] = 0;
        diffData[i + 2] = 0;
        diffData[i + 3] = 0;
      } else {
        diffData[i + 3] = 255;
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
  const encodedFramesInfo = frames.map((_, i) => ({
    isDiff: i > 0,
    dispose: 1, // Default: Do not dispose
  }));

  encodedFramesInfo[0].isDiff = false;

  for (let i = 0; i < frames.length; i++) {
    const nextI = (i + 1) % frames.length;
    if (needsClear(frames[nextI].imageData, frames[i].imageData)) {
      encodedFramesInfo[i].dispose = 2; // Restore to background color
      encodedFramesInfo[nextI].isDiff = false; // Next frame must be a full frame
    }
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

  let sampleIdx = 0;
  for (const frame of frames) {
    const data = frame.imageData.data;
    for (let i = 0; i < data.length; i += 4 * sampleStride) {
      if (sampleIdx < sampledData.length) {
        if (data[i + 3] < 128) {
          sampledData[sampleIdx] = 0;
          sampledData[sampleIdx + 1] = 0;
          sampledData[sampleIdx + 2] = 0;
          sampledData[sampleIdx + 3] = 0;
        } else {
          sampledData[sampleIdx] = data[i];
          sampledData[sampleIdx + 1] = data[i + 1];
          sampledData[sampleIdx + 2] = data[i + 2];
          sampledData[sampleIdx + 3] = 255;
        }
        sampleIdx += 4;
      }
    }
  }

  const maxColors = countUniqueColors(sampledData.slice(0, sampleIdx));
  const globalPalette = quantize(sampledData.slice(0, sampleIdx), maxColors, {
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
    const temp = globalPalette[0];
    globalPalette[0] = globalPalette[transparentIndex];
    globalPalette[transparentIndex] = temp;
    transparentIndex = 0;
  }

  for (const [i, frame] of frames.entries()) {
    const { width, height } = frame.imageData;
    const info = encodedFramesInfo[i];
    let frameToEncode: ImageData;

    if (info.isDiff) {
      frameToEncode = createDiffFrame(
        frame.imageData,
        frames[i - 1].imageData,
        16, // Threshold for color distance squared
      );
    } else {
      // Even if not a diff frame, enforce binary alpha for clean palette mapping
      const data = new Uint8ClampedArray(frame.imageData.data);
      for (let j = 0; j < data.length; j += 4) {
        if (data[j + 3] < 128) {
          data[j] = 0;
          data[j + 1] = 0;
          data[j + 2] = 0;
          data[j + 3] = 0;
        } else {
          data[j + 3] = 255;
        }
      }
      frameToEncode = new ImageData(data, width, height);
    }

    const index = applyPalette(frameToEncode.data, globalPalette, format);

    encoder.writeFrame(index, width, height, {
      palette: globalPalette,
      transparent: true,
      transparentIndex,
      delay: frame.delay,
      dispose: info.dispose,
      ...(i === 0 ? { repeat: 0 } : {}),
    });
  }

  encoder.finish();
  return new File([encoder.bytes() as Uint8Array<ArrayBuffer>], filename, {
    type: "image/gif",
  });
};
