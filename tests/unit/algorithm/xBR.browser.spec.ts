import { afterEach, describe, expect, test } from "vitest";

import { xBR } from "@/algorithm/xBR";
import { ScaleError } from "@/models/errors/ScaleError";
import { PSImageData } from "@/models/InputImageData";

import { createMockPSImageDataObject } from "./helpers";

describe("xBR", () => {
  let revokeUrls: string[] = [];

  afterEach(() => {
    for (const url of revokeUrls) {
      URL.revokeObjectURL(url);
    }
    revokeUrls = [];
  });

  describe("valid scaling", () => {
    test.each<{
      description: string;
      inputWidth: number;
      inputHeight: number;
      originalPixelSize: number;
      scalePercentage: number;
      expectedWidth: number;
      expectedHeight: number;
    }>([
      {
        description: "should scale image to 200% using xBR algorithm",
        inputWidth: 4,
        inputHeight: 4,
        originalPixelSize: 2,
        scalePercentage: 200,
        expectedWidth: 8,
        expectedHeight: 8,
      },
      {
        description: "should scale image to 300% using xBR algorithm",
        inputWidth: 2,
        inputHeight: 2,
        originalPixelSize: 1,
        scalePercentage: 300,
        expectedWidth: 6,
        expectedHeight: 6,
      },
      {
        description: "should scale image to 400% using xBR algorithm",
        inputWidth: 2,
        inputHeight: 2,
        originalPixelSize: 1,
        scalePercentage: 400,
        expectedWidth: 8,
        expectedHeight: 8,
      },
      {
        description: "should handle rectangular images with valid dimensions",
        inputWidth: 6,
        inputHeight: 4,
        originalPixelSize: 2,
        scalePercentage: 200,
        expectedWidth: 12,
        expectedHeight: 8,
      },
    ])(
      "$description",
      async ({
        inputWidth,
        inputHeight,
        originalPixelSize,
        scalePercentage,
        expectedWidth,
        expectedHeight,
      }) => {
        const inputImageData = await createMockPSImageDataObject(
          inputWidth,
          inputHeight,
          originalPixelSize,
          "pixelart",
        );

        const result = await xBR(inputImageData, scalePercentage);

        expect(result).toBeInstanceOf(PSImageData);
        expect(result.width).toBe(expectedWidth);
        expect(result.height).toBe(expectedHeight);
        expect(result.originalPixelSize).toBe(originalPixelSize);
      },
    );

    test("should generate valid image data after xBR scaling", async () => {
      const originalPixelSize = 1;
      const inputImageData = await createMockPSImageDataObject(
        2,
        2,
        originalPixelSize,
        "pixelart",
      );

      const result = await xBR(inputImageData, 200);

      expect(result.imageData).toBeInstanceOf(ImageData);
      expect(result.imageData.width).toBe(4);
      expect(result.imageData.height).toBe(4);
      expect(result.imageData.data.length).toBe(4 * 4 * 4); // width * height * 4 (RGBA)

      // Test if generated URL is valid
      const url = result.toUrl();
      expect(url).toMatch(/^data:image\/png;base64,/);

      const img = new Image();
      img.src = url;
      await img.decode();

      revokeUrls.push(url);
    });
  });

  describe("error handling", () => {
    test.each<{
      description: string;
      inputWidth: number;
      inputHeight: number;
      originalPixelSize: number;
    }>([
      {
        description:
          "should throw ScaleError for invalid image size (width not multiple of originalPixelSize)",
        inputWidth: 4,
        inputHeight: 6,
        originalPixelSize: 3,
      },
      {
        description:
          "should throw ScaleError for invalid image size (height not multiple of originalPixelSize)",
        inputWidth: 6,
        inputHeight: 4,
        originalPixelSize: 3,
      },
      {
        description:
          "should throw ScaleError for invalid image size (both dimensions invalid)",
        inputWidth: 4,
        inputHeight: 5,
        originalPixelSize: 3,
      },
    ])(
      "$description",
      async ({ inputWidth, inputHeight, originalPixelSize }) => {
        const inputImageData = await createMockPSImageDataObject(
          inputWidth,
          inputHeight,
          originalPixelSize,
          "pixelart",
        );

        await expect(xBR(inputImageData, 200)).rejects.toThrow(ScaleError);
        await expect(xBR(inputImageData, 200)).rejects.toThrow(
          "invalid-image-size",
        );
      },
    );
  });

  describe("large scale handling", () => {
    test.each<{
      description: string;
      inputWidth: number;
      inputHeight: number;
      originalPixelSize: number;
      scalePercentage: number;
      expectedWidth: number;
      expectedHeight: number;
    }>([
      {
        description: "should handle scaling larger than 400%",
        inputWidth: 2,
        inputHeight: 2,
        originalPixelSize: 1,
        scalePercentage: 800,
        expectedWidth: 16,
        expectedHeight: 16,
      },
      {
        description: "should handle very large scaling",
        inputWidth: 1,
        inputHeight: 1,
        originalPixelSize: 1,
        scalePercentage: 1600,
        expectedWidth: 16,
        expectedHeight: 16,
      },
    ])(
      "$description",
      async ({
        inputWidth,
        inputHeight,
        originalPixelSize,
        scalePercentage,
        expectedWidth,
        expectedHeight,
      }) => {
        const inputImageData = await createMockPSImageDataObject(
          inputWidth,
          inputHeight,
          originalPixelSize,
          "pixelart",
        );

        const result = await xBR(inputImageData, scalePercentage);

        expect(result).toBeInstanceOf(PSImageData);
        expect(result.width).toBe(expectedWidth);
        expect(result.height).toBe(expectedHeight);
        expect(result.originalPixelSize).toBe(originalPixelSize);
      },
    );
  });
});
