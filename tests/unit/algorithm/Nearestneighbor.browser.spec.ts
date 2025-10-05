import { afterEach, describe, expect, test } from "vitest";

import { nearestNeighbor } from "@/algorithm/Nearestneighbor";
import { PSImageData } from "@/models/InputImageData";

import { createMockPSImageDataObject } from "./helpers";

describe("nearestNeighbor", () => {
  let revokeUrls: string[] = [];

  afterEach(() => {
    for (const url of revokeUrls) {
      URL.revokeObjectURL(url);
    }
    revokeUrls = [];
  });

  test.each<{
    description: string;
    inputWidth: number;
    inputHeight: number;
    originalPixelSize?: number;
    scalePercentage: number;
    expectedWidth: number;
    expectedHeight: number;
  }>([
    {
      description: "should scale image to 200% using nearest neighbor",
      inputWidth: 4,
      inputHeight: 4,
      scalePercentage: 200,
      expectedWidth: 8,
      expectedHeight: 8,
    },
    {
      description: "should scale image to 50% using nearest neighbor",
      inputWidth: 8,
      inputHeight: 8,
      scalePercentage: 50,
      expectedWidth: 4,
      expectedHeight: 4,
    },
    {
      description: "should scale image to 300% using nearest neighbor",
      inputWidth: 2,
      inputHeight: 2,
      scalePercentage: 300,
      expectedWidth: 6,
      expectedHeight: 6,
    },
    {
      description: "should handle rectangular images",
      inputWidth: 6,
      inputHeight: 4,
      scalePercentage: 150,
      expectedWidth: 9,
      expectedHeight: 6,
    },
    {
      description: "should preserve original pixel size when scaling",
      inputWidth: 4,
      inputHeight: 4,
      originalPixelSize: 2,
      scalePercentage: 200,
      expectedWidth: 8,
      expectedHeight: 8,
    },
    {
      description: "should handle 1px image scaling",
      inputWidth: 1,
      inputHeight: 1,
      scalePercentage: 400,
      expectedWidth: 4,
      expectedHeight: 4,
    },
  ])(
    "$description",
    async ({
      inputWidth,
      inputHeight,
      originalPixelSize = 1,
      scalePercentage,
      expectedWidth,
      expectedHeight,
    }) => {
      const inputImageData = await createMockPSImageDataObject(
        inputWidth,
        inputHeight,
        originalPixelSize,
      );

      const result = await nearestNeighbor(inputImageData, scalePercentage);

      expect(result).toBeInstanceOf(PSImageData);
      expect(result.width).toBe(expectedWidth);
      expect(result.height).toBe(expectedHeight);
      expect(result.originalPixelSize).toBe(originalPixelSize);
    },
  );

  test("should generate valid image data after scaling", async () => {
    const inputImageData = await createMockPSImageDataObject(2, 2);

    const result = await nearestNeighbor(inputImageData, 200);

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
