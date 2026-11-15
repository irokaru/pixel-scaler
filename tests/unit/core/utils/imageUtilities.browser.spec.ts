import { describe, test, expect } from "vitest";

import { imageDataToFile } from "@/core/utils/imageUtilities";

const createImageData = (): ImageData => {
  const data = new Uint8ClampedArray(4 * 4 * 4);
  for (let index = 0; index < data.length; index += 4) {
    data[index] = 255; // R
    data[index + 1] = 0; // G
    data[index + 2] = 0; // B
    data[index + 3] = 255; // A (opaque)
  }
  return new ImageData(data, 4, 4);
};

const GIF_HEADER = new Uint8Array([0x47, 0x49, 0x46, 0x38]); // "GIF8"

describe("imageDataToFile", () => {
  describe("GIF encoding", () => {
    test("should return File with image/gif type", async () => {
      const imageData = createImageData();

      const file = await imageDataToFile(imageData, "test.gif", "image/gif");

      expect(file.name).toBe("test.gif");
      expect(file.type).toBe("image/gif");
    });

    test("output binary should start with GIF8 header", async () => {
      const imageData = createImageData();

      const file = await imageDataToFile(imageData, "test.gif", "image/gif");
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      expect(bytes.subarray(0, 4)).toEqual(GIF_HEADER);
    });

    test("should handle transparent pixels (alpha < 128)", async () => {
      const data = new Uint8ClampedArray(4 * 4 * 4);
      for (let index = 0; index < data.length; index += 4) {
        data[index] = 255;
        data[index + 1] = 0;
        data[index + 2] = 0;
        data[index + 3] = 0; // fully transparent
      }
      const imageData = new ImageData(data, 4, 4);

      const file = await imageDataToFile(
        imageData,
        "transparent.gif",
        "image/gif",
      );
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      expect(bytes.subarray(0, 4)).toEqual(GIF_HEADER);
    });
  });

  describe("PNG encoding", () => {
    test("should return File with image/png type for PNG", async () => {
      const imageData = createImageData();

      const file = await imageDataToFile(imageData, "test.png", "image/png");

      expect(file.name).toBe("test.png");
      expect(file.type).toBe("image/png");
    });

    test("PNG binary should start with PNG header", async () => {
      const imageData = createImageData();

      const file = await imageDataToFile(imageData, "test.png", "image/png");
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      // PNG signature: 0x89 0x50 0x4E 0x47
      expect(bytes[0]).toBe(0x89);
      expect(bytes[1]).toBe(0x50);
      expect(bytes[2]).toBe(0x4e);
      expect(bytes[3]).toBe(0x47);
    });
  });

  describe("JPEG encoding", () => {
    test("should return File with image/jpeg type for JPEG", async () => {
      const imageData = createImageData();

      const file = await imageDataToFile(imageData, "test.jpg", "image/jpeg");

      expect(file.name).toBe("test.jpg");
      expect(file.type).toBe("image/jpeg");
    });
  });
});
