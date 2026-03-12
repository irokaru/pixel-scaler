import { describe, test, expect } from "vitest";

import {
  hasTransparentPixels,
  countUniqueColors,
  encodeAsGif,
} from "@/core/utils/gif";

const GIF_HEADER = new Uint8Array([0x47, 0x49, 0x46, 0x38]); // "GIF8"

const generate300UniqueColorPixels = (): Uint8ClampedArray => {
  const data = new Uint8ClampedArray(300 * 4);
  for (let i = 0; i < 300; i++) {
    data[i * 4] = i % 256;
    data[i * 4 + 1] = Math.floor(i / 256);
    data[i * 4 + 2] = 0;
    data[i * 4 + 3] = 255;
  }
  return data;
};

describe("hasTransparentPixels", () => {
  test.each<{ description: string; pixels: number[]; expected: boolean }>([
    {
      description: "all pixels are fully opaque",
      pixels: [255, 0, 0, 255, 0, 255, 0, 255],
      expected: false,
    },
    {
      description: "at least one pixel is semi-transparent",
      pixels: [255, 0, 0, 255, 0, 0, 255, 128],
      expected: true,
    },
    {
      description: "all pixels are fully transparent",
      pixels: [255, 0, 0, 0, 0, 0, 255, 0],
      expected: true,
    },
  ])("should return $expected when $description", ({ pixels, expected }) => {
    const data = new Uint8ClampedArray(pixels);
    expect(hasTransparentPixels(data)).toBe(expected);
  });
});

describe("countUniqueColors", () => {
  test.each<{ description: string; data: Uint8ClampedArray; expected: number }>(
    [
      {
        description: "single-color image",
        data: new Uint8ClampedArray([255, 0, 0, 255, 255, 0, 0, 255]),
        expected: 2,
      },
      {
        description: "3 distinct RGBA colors",
        data: new Uint8ClampedArray([
          255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255,
        ]),
        expected: 3,
      },
      {
        description: "more than 256 unique colors (capped at 256)",
        data: generate300UniqueColorPixels(),
        expected: 256,
      },
      {
        description: "pixels differing only in alpha treated as distinct",
        data: new Uint8ClampedArray([255, 0, 0, 255, 255, 0, 0, 0]),
        expected: 2,
      },
    ],
  )("should return $expected for $description", ({ data, expected }) => {
    expect(countUniqueColors(data)).toBe(expected);
  });
});

describe("encodeAsGif", () => {
  const createImageData = (
    width: number,
    height: number,
    alpha = 255,
  ): ImageData => {
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255; // R
      data[i + 1] = 0; // G
      data[i + 2] = 0; // B
      data[i + 3] = alpha; // A
    }
    return new ImageData(data, width, height);
  };

  test.each<{ description: string; alpha: number }>([
    { description: "opaque image", alpha: 255 },
    { description: "fully transparent image", alpha: 0 },
  ])("should produce valid GIF file for $description", async ({ alpha }) => {
    const imageData = createImageData(4, 4, alpha);
    const file = encodeAsGif(imageData, "test.gif");

    expect(file.name).toBe("test.gif");
    expect(file.type).toBe("image/gif");

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    expect(bytes.subarray(0, 4)).toEqual(GIF_HEADER);
  });
});
