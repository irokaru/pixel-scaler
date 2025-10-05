import { PSImageDataObject } from "@/@types/convert";
import { PSImageData } from "@/models/InputImageData";

/**
 * Helper function to create mock PSImageDataObject for testing
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
  const ctx = canvas.getContext("2d")!;

  if (pattern === "checkerboard") {
    // Checkerboard pattern for nearest neighbor tests
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, Math.ceil(width / 2), Math.ceil(height / 2));
    ctx.fillStyle = "blue";
    ctx.fillRect(Math.ceil(width / 2), 0, width, Math.ceil(height / 2));
    ctx.fillStyle = "green";
    ctx.fillRect(0, Math.ceil(height / 2), Math.ceil(width / 2), height);
    ctx.fillStyle = "yellow";
    ctx.fillRect(Math.ceil(width / 2), Math.ceil(height / 2), width, height);
  } else if (pattern === "pixelart") {
    // Pixel art pattern for xBR tests
    const pixelSize = originalPixelSize;
    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const colorIndex = (x / pixelSize + y / pixelSize) % 4;
        const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00"];
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  }

  const dataURL = canvas.toDataURL("image/png");
  const base64Data = dataURL.split(",")[1];
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.codePointAt(i) ?? 0;
  }

  const file = new File([bytes], `${width}x${height}.png`, {
    type: "image/png",
  });
  const psImageData = await PSImageData.init(file);
  psImageData.originalPixelSize = originalPixelSize;

  return psImageData.toObject();
};
