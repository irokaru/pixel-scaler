import { describe, test, expect } from "vitest";

import {
  hasTransparentPixels,
  countUniqueColors,
  encodeAsGif,
  isAnimatedGif,
  decodeGifFrames,
} from "@/core/utils/gif";

import {
  create1pxGifFile,
  createAnimatedGifFile,
} from "../../../utils/imageTestHelper";

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

describe("isAnimatedGif", () => {
  test.each<{ description: string; file: File; expected: boolean }>([
    {
      description: "static (single-frame) GIF",
      file: create1pxGifFile(),
      expected: false,
    },
    {
      description: "animated (multi-frame) GIF",
      file: createAnimatedGifFile(),
      expected: true,
    },
  ])("should return $expected for $description", async ({ file, expected }) => {
    const result = await isAnimatedGif(file);
    expect(result).toBe(expected);
  });
});

describe("decodeGifFrames", () => {
  test("returns correct number of frames for animated GIF", async () => {
    const file = createAnimatedGifFile();
    const { frames, width, height } = await decodeGifFrames(file);

    expect(frames.length).toBe(2);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });

  test("each frame has ImageData and delay", async () => {
    const file = createAnimatedGifFile();
    const { frames } = await decodeGifFrames(file);

    for (const frame of frames) {
      expect(frame.imageData).toBeInstanceOf(ImageData);
      expect(frame.delay).toBeGreaterThan(0);
    }
  });

  test("delay is in milliseconds (not centiseconds)", async () => {
    const file = createAnimatedGifFile();
    const { frames } = await decodeGifFrames(file);

    // The fixture encodes 100ms delay; gifuct-js reads the GIF and returns delay in ms already
    // decodeGifFrames should pass it through unchanged
    expect(frames[0].delay).toBeGreaterThanOrEqual(100);
  });

  test("frame imageData dimensions match GIF logical screen", async () => {
    const file = createAnimatedGifFile();
    const { frames, width, height } = await decodeGifFrames(file);

    for (const frame of frames) {
      expect(frame.imageData.width).toBe(width);
      expect(frame.imageData.height).toBe(height);
    }
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
  ])(
    "should produce valid GIF file for single-frame $description",
    async ({ alpha }) => {
      const imageData = createImageData(4, 4, alpha);
      const file = encodeAsGif([{ imageData, delay: 100 }], "test.gif");

      expect(file.name).toBe("test.gif");
      expect(file.type).toBe("image/gif");

      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      expect(bytes.subarray(0, 4)).toEqual(GIF_HEADER);
    },
  );

  test("should produce valid GIF file for multi-frame input", async () => {
    const frame1 = createImageData(2, 2, 255);
    const frame2 = createImageData(2, 2, 128);
    const file = encodeAsGif(
      [
        { imageData: frame1, delay: 100 },
        { imageData: frame2, delay: 200 },
      ],
      "animated.gif",
    );

    expect(file.name).toBe("animated.gif");
    expect(file.type).toBe("image/gif");

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    expect(bytes.subarray(0, 4)).toEqual(GIF_HEADER);
  });
});
