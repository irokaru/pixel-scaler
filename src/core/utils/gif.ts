import { GIFEncoder, quantize, applyPalette, Format } from "gifenc";

export const hasTransparentPixels = (data: Uint8ClampedArray): boolean => {
  return Array.from(
    { length: data.length / 4 },
    (_, i) => data[i * 4 + 3],
  ).some((a) => a < 255);
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

// NOTE: For animated GIFs, only the first frame is processed
// TODO: Add support for animated GIFs
export const encodeAsGif = (imageData: ImageData, filename: string): File => {
  const { width, height, data } = imageData;

  const transparent = hasTransparentPixels(data);
  // NOTE: rgba4444 is the only gifenc format supporting alpha; use rgb565 otherwise for higher fidelity
  const format: Format = transparent ? "rgba4444" : "rgb565";

  const maxColors = countUniqueColors(data);
  const palette = quantize(data, maxColors, { format });
  const index = applyPalette(data, palette, format);

  const encoder = GIFEncoder();
  encoder.writeFrame(index, width, height, { palette, transparent });
  encoder.finish();
  // NOTE: gifenc's TypeScript types are inaccurate and cause the bytes property to be typed as Uint8Array<number>, which is not compatible with the File constructor. We need to assert it as Uint8Array<ArrayBuffer> to satisfy the type checker.
  return new File([encoder.bytes() as Uint8Array<ArrayBuffer>], filename, {
    type: "image/gif",
  });
};
