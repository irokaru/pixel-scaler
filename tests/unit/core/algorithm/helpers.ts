import { createPSImageData } from "@/core/models/InputImageData";
import type { PSImageDataObject } from "@/types/convert";

/**
Helper function to create mock PSImageDataObject for testing
*/
export const createMockPSImageDataObject = async (
  width: number,
  height: number,
  originalPixelSize: number = 1,
  pattern: "checkerboard" | "pixelart" = "checkerboard",
): Promise<PSImageDataObject> => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d")!;

  if (pattern === "checkerboard") {
    // Checkerboard pattern for nearest neighbor tests
    context.fillStyle = "red";
    context.fillRect(0, 0, Math.ceil(width / 2), Math.ceil(height / 2));
    context.fillStyle = "blue";
    context.fillRect(Math.ceil(width / 2), 0, width, Math.ceil(height / 2));
    context.fillStyle = "green";
    context.fillRect(0, Math.ceil(height / 2), Math.ceil(width / 2), height);
    context.fillStyle = "yellow";
    context.fillRect(
      Math.ceil(width / 2),
      Math.ceil(height / 2),
      width,
      height,
    );
  } else if (pattern === "pixelart") {
    // Pixel art pattern for xBR tests
    const pixelSize = originalPixelSize;
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const colorIndex = (x / pixelSize + y / pixelSize) % 4;
        const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
        context.fillStyle = colors[colorIndex];
        context.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  }

  const dataURL = canvas.toDataURL("image/png");
  const base64Data = dataURL.split(",", 2)[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let index = 0; index < binaryString.length; index++) {
    bytes[index] = binaryString.codePointAt(index) ?? 0;
  }

  const file = new File([bytes], `${width}x${height}.png`, {
    type: "image/png",
  });
  const object = await createPSImageData(file);
  object.originalPixelSize = originalPixelSize;

  return object;
};
