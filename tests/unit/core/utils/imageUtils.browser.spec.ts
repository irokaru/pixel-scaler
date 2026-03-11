import { describe, test, expect } from "vitest";

import { imageDataToFile, countUniqueColors } from "@/core/utils/imageUtils";

const createImageData = (width: number, height: number): ImageData => {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255; // R
    data[i + 1] = 0; // G
    data[i + 2] = 0; // B
    data[i + 3] = 255; // A (opaque)
  }
  return new ImageData(data, width, height);
};

const GIF_HEADER = new Uint8Array([0x47, 0x49, 0x46, 0x38]); // "GIF8"

describe("imageDataToFile", () => {
  describe("GIF encoding", () => {
    test("should return File with image/gif type", async () => {
      const imageData = createImageData(4, 4);

      const file = await imageDataToFile(imageData, "test.gif", "image/gif");

      expect(file.name).toBe("test.gif");
      expect(file.type).toBe("image/gif");
    });

    test("output binary should start with GIF8 header", async () => {
      const imageData = createImageData(4, 4);

      const file = await imageDataToFile(imageData, "test.gif", "image/gif");
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);

      expect(bytes.subarray(0, 4)).toEqual(GIF_HEADER);
    });

    test("should handle transparent pixels (alpha < 128)", async () => {
      const data = new Uint8ClampedArray(4 * 4 * 4);
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0; // fully transparent
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
      const imageData = createImageData(4, 4);

      const file = await imageDataToFile(imageData, "test.png", "image/png");

      expect(file.name).toBe("test.png");
      expect(file.type).toBe("image/png");
    });

    test("PNG binary should start with PNG header", async () => {
      const imageData = createImageData(4, 4);

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
      const imageData = createImageData(4, 4);

      const file = await imageDataToFile(imageData, "test.jpg", "image/jpeg");

      expect(file.name).toBe("test.jpg");
      expect(file.type).toBe("image/jpeg");
    });
  });
});

describe("countUniqueColors", () => {
  test("should return 2 (minimum) for a single-color image", () => {
    const data = new Uint8ClampedArray([255, 0, 0, 255, 255, 0, 0, 255]);
    expect(countUniqueColors(data)).toBe(2);
  });

  test("should count distinct RGBA colors correctly", () => {
    const data = new Uint8ClampedArray([
      255,
      0,
      0,
      255, // red
      0,
      255,
      0,
      255, // green
      0,
      0,
      255,
      255, // blue
    ]);
    expect(countUniqueColors(data)).toBe(3);
  });

  test("should cap at 256 for images with more than 256 unique colors", () => {
    const pixels = 300;
    const data = new Uint8ClampedArray(pixels * 4);
    for (let i = 0; i < pixels; i++) {
      // generate unique colors by varying R and G channels
      data[i * 4] = i % 256;
      data[i * 4 + 1] = Math.floor(i / 256);
      data[i * 4 + 2] = 0;
      data[i * 4 + 3] = 255;
    }
    expect(countUniqueColors(data)).toBe(256);
  });

  test("should treat pixels differing only in alpha as distinct colors", () => {
    const data = new Uint8ClampedArray([
      255,
      0,
      0,
      255, // opaque red
      255,
      0,
      0,
      0, // transparent red
    ]);
    expect(countUniqueColors(data)).toBe(2);
  });
});
