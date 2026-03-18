vi.mock("@/core/models/InputImageData");

import { ScaleMode } from "@/constants/form";
import * as algorithm from "@/core/algorithm";
import { createPSImageData } from "@/core/models/InputImageData";
import {
  getScaleMethod,
  convertImage,
  isDuplicateEntry,
} from "@/core/services/image/convertService";
import type { AnimatedGifPSImageDataObject, ImageEntry } from "@/types/convert";

import { dummyImageEntry } from "../../../__mocks__/models/InputImageData";

describe("convertService", () => {
  describe("getScaleMethod", () => {
    test("returns xBR for Smooth mode", () => {
      const method = getScaleMethod(ScaleMode.Smooth);
      expect(method).toBe(algorithm.xBR);
    });

    test("returns nearestNeighbor for Nearest mode", () => {
      const method = getScaleMethod(ScaleMode.Nearest);
      expect(method).toBe(algorithm.nearestNeighbor);
    });
  });

  describe("convertImage", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("converts image with correct scale method", async () => {
      const xBRMock = vi
        .spyOn(algorithm, "xBR")
        .mockResolvedValue(await createPSImageData(new File([], "scaled.png")));

      const entry = await dummyImageEntry({
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });

      const result = await convertImage(entry);

      expect(xBRMock).toHaveBeenCalledWith(entry.image, 200);
      expect(result.status).toBe("scaled");
    });

    test("converts image with nearestNeighbor method", async () => {
      const nearestMock = vi
        .spyOn(algorithm, "nearestNeighbor")
        .mockResolvedValue(await createPSImageData(new File([], "scaled.png")));

      const entry = await dummyImageEntry({
        settings: { scaleSizePercent: 300, scaleMode: ScaleMode.Nearest },
      });

      const result = await convertImage(entry);

      expect(nearestMock).toHaveBeenCalledWith(entry.image, 300);
      expect(result.status).toBe("scaled");
    });

    test("converts animated GIF by processing each frame", async () => {
      const scaledImageData = new ImageData(2, 2);
      const scaledEntry = await createPSImageData(new File([], "scaled.png"));
      const scaledWithImageData = {
        ...scaledEntry,
        imageData: scaledImageData,
      };
      const xBRMock = vi
        .spyOn(algorithm, "xBR")
        .mockResolvedValue(scaledWithImageData);

      const frame1ImageData = new ImageData(1, 1);
      const frame2ImageData = new ImageData(1, 1);
      const animatedImage: AnimatedGifPSImageDataObject = {
        uuid: "test-uuid",
        data: new File([], "animated.gif", { type: "image/gif" }),
        imageData: frame1ImageData,
        frames: [
          { imageData: frame1ImageData, delay: 100 },
          { imageData: frame2ImageData, delay: 200 },
        ],
        width: 1,
        height: 1,
        originalPixelSize: 0,
        url: "data:image/gif;base64,mock",
        status: "loaded",
        animated: true,
      };

      const entry: ImageEntry = {
        image: animatedImage,
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
        errors: [],
      };

      const result = await convertImage(entry);

      expect(xBRMock).toHaveBeenCalledTimes(2);
      expect(result.animated).toBe(true);
      expect(result.status).toBe("scaled");
    });
  });

  describe("isDuplicateEntry", () => {
    test("returns true for duplicate entry", async () => {
      const entry = await dummyImageEntry({
        image: { data: new File([], "test.png") },
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });

      const existingList: ImageEntry[] = [
        {
          image: {
            ...entry.image,
            data: new File([], "test.png"),
          },
          settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
          errors: [],
        },
      ];

      const result = isDuplicateEntry(entry, existingList);

      expect(result).toBe(true);
    });

    test("returns false for different filename", async () => {
      const entry = await dummyImageEntry({
        image: { data: new File([], "test1.png") },
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });

      const existingList: ImageEntry[] = [
        {
          image: {
            ...entry.image,
            data: new File([], "test2.png"),
          },
          settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
          errors: [],
        },
      ];

      const result = isDuplicateEntry(entry, existingList);

      expect(result).toBe(false);
    });

    test("returns false for different scale percent", async () => {
      const entry = await dummyImageEntry({
        image: { data: new File([], "test.png") },
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });

      const existingList: ImageEntry[] = [
        {
          image: {
            ...entry.image,
            data: new File([], "test.png"),
          },
          settings: { scaleSizePercent: 300, scaleMode: ScaleMode.Smooth },
          errors: [],
        },
      ];

      const result = isDuplicateEntry(entry, existingList);

      expect(result).toBe(false);
    });

    test("returns false for different scale mode", async () => {
      const entry = await dummyImageEntry({
        image: { data: new File([], "test.png") },
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });

      const existingList: ImageEntry[] = [
        {
          image: {
            ...entry.image,
            data: new File([], "test.png"),
          },
          settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Nearest },
          errors: [],
        },
      ];

      const result = isDuplicateEntry(entry, existingList);

      expect(result).toBe(false);
    });

    test("returns false for different original pixel size", async () => {
      const entry = await dummyImageEntry({
        image: {
          data: new File([], "test.png"),
          originalPixelSize: 100,
        },
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });

      const existingList: ImageEntry[] = [
        {
          image: {
            ...entry.image,
            data: new File([], "test.png"),
            originalPixelSize: 200,
          },
          settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
          errors: [],
        },
      ];

      const result = isDuplicateEntry(entry, existingList);

      expect(result).toBe(false);
    });

    test("returns false for empty existing list", async () => {
      const entry = await dummyImageEntry({
        image: { data: new File([], "test.png") },
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });

      const result = isDuplicateEntry(entry, []);

      expect(result).toBe(false);
    });
  });
});
