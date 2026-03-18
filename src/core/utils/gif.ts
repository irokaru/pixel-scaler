import { GIFEncoder, quantize, applyPalette, type Format } from "gifenc";
import { parseGIF, decompressFrames } from "gifuct-js";

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

  const frames: GifFrame[] = rawFrames.map((frame) => {
    const patchImageData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frame.dims.width,
      frame.dims.height,
    );
    // disposalType 2: clear canvas before drawing next frame
    // TODO: disposalType 3 (restore to previous frame) is not implemented
    if (frame.disposalType === 2) {
      ctx.clearRect(0, 0, width, height);
    }
    ctx.putImageData(patchImageData, frame.dims.left, frame.dims.top);
    return {
      imageData: ctx.getImageData(0, 0, width, height),
      delay: frame.delay ?? 100, // gifuct-js returns delay already in ms
    };
  });

  return { frames, width, height };
};

export const encodeAsGif = (frames: GifFrame[], filename: string): File => {
  const encoder = GIFEncoder();

  for (const [i, { imageData, delay }] of frames.entries()) {
    const { width, height, data } = imageData;
    // NOTE: rgba4444 is the only gifenc format supporting alpha; use rgb565 otherwise for higher fidelity
    const transparent = hasTransparentPixels(data);
    const format: Format = transparent ? "rgba4444" : "rgb565";
    const maxColors = countUniqueColors(data);
    const palette = quantize(data, maxColors, { format });
    const index = applyPalette(data, palette, format);
    encoder.writeFrame(index, width, height, {
      palette,
      transparent,
      delay,
      // NOTE: repeat is set only on the first frame to configure the NETSCAPE loop extension
      // TODO: preserve original loopCount when gifuct-js exposes a reliable API for it
      ...(i === 0 ? { repeat: 0 } : {}),
    });
  }

  encoder.finish();
  // NOTE: gifenc's TypeScript types are inaccurate and cause the bytes property to be typed as Uint8Array<number>, which is not compatible with the File constructor. We need to assert it as Uint8Array<ArrayBuffer> to satisfy the type checker.
  return new File([encoder.bytes() as Uint8Array<ArrayBuffer>], filename, {
    type: "image/gif",
  });
};
