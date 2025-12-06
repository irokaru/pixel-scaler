import { ImageEntry } from "@/@types/convert";
import { ScaleMode } from "@/constants/form";
import { PSImageData } from "@/models/InputImageData";

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
 * Creates a complete ImageEntry for testing purposes.
 * This helper initializes a PSImageData from a 1x1 PNG file.
 *
 * @returns A Promise resolving to an ImageEntry with default settings
 */
export const createImageEntry = async (): Promise<ImageEntry> => {
  const file = create1pxPngFile();
  const imageData = await PSImageData.init(file);
  imageData.originalPixelSize = 1;
  return {
    image: imageData.toObject(),
    settings: { scaleSizePercent: 100, scaleMode: ScaleMode.Smooth },
    errors: [],
  };
};
