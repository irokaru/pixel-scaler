import { ScaleMode } from "@/constants/form";
import { createPSImageData } from "@/core/models/InputImageData";
import type { ImageEntry } from "@/types/convert";

/**
 * Creates a 1x1 red PNG file for testing purposes.
 * This helper is used in browser environment tests where Canvas API is available.
 *
 * @returns A File object containing a valid 1x1 PNG image
 */
export const create1pxPngFile = (): File => {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, 1, 1);

  const dataURL = canvas.toDataURL("image/png");
  const base64Data = dataURL.split(",")[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.codePointAt(i) ?? 0;
  }

  return new File([bytes], "test.png", { type: "image/png" });
};

/**
 * Creates a 2x2 PNG file with different colored pixels for testing purposes.
 * This helper is used in browser environment tests where Canvas API is available.
 *
 * @returns A File object containing a valid 2x2 PNG image
 */
export const create2pxPngFile = (): File => {
  const canvas = document.createElement("canvas");
  canvas.width = 2;
  canvas.height = 2;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = "green";
  ctx.fillRect(1, 0, 1, 1);
  ctx.fillStyle = "red";
  ctx.fillRect(0, 1, 1, 1);
  ctx.fillStyle = "yellow";
  ctx.fillRect(1, 1, 1, 1);

  const dataURL = canvas.toDataURL("image/png");
  const base64Data = dataURL.split(",")[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.codePointAt(i) ?? 0;
  }

  return new File([bytes], "2px.png", { type: "image/png" });
};

/**
 * Creates a minimal valid GIF file (1x1 red pixel, GIF87a) for testing purposes.
 *
 * @returns A File object containing a valid 1x1 GIF image
 */
export const create1pxGifFile = (): File => {
  const gifBytes = new Uint8Array([
    0x47,
    0x49,
    0x46,
    0x38,
    0x37,
    0x61, // GIF87a
    0x01,
    0x00,
    0x01,
    0x00,
    0x80,
    0x00,
    0x00, // Logical Screen Descriptor
    0xff,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00, // Global Color Table (red, black)
    0x2c,
    0x00,
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    0x01,
    0x00,
    0x00, // Image Descriptor
    0x02,
    0x02,
    0x4c,
    0x01,
    0x00, // Image Data
    0x3b, // Trailer
  ]);
  return new File([gifBytes], "test.gif", { type: "image/gif" });
};

/**
 * Creates a complete ImageEntry for testing purposes.
 * This helper initializes a PSImageData from a 1x1 PNG file by default,
 * or from the provided file.
 *
 * @returns A Promise resolving to an ImageEntry with default settings
 */
export const createImageEntry = async (
  options: { file?: File } = {},
): Promise<ImageEntry> => {
  const file = options.file ?? create1pxPngFile();
  const image = await createPSImageData(file);
  image.originalPixelSize = 1;
  return {
    image,
    settings: { scaleSizePercent: 100, scaleMode: ScaleMode.Smooth },
    errors: [],
  };
};
