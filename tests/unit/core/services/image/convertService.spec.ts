vi.mock("@/models/InputImageData");

import { ImageEntry } from "@/@types/convert";
import * as algorithm from "@/algorithm";
import { ScaleMode } from "@/constants/form";
import {
  getScaleMethod,
  convertImage,
  isDuplicateEntry,
} from "@/core/services/image/convertService";
import { PSImageData } from "@/models/InputImageData";

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
    test("converts image with correct scale method", async () => {
      const xBRMock = vi
        .spyOn(algorithm, "xBR")
        .mockResolvedValue(await PSImageData.init(new File([], "scaled.png")));

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
        .mockResolvedValue(await PSImageData.init(new File([], "scaled.png")));

      const entry = await dummyImageEntry({
        settings: { scaleSizePercent: 300, scaleMode: ScaleMode.Nearest },
      });

      const result = await convertImage(entry);

      expect(nearestMock).toHaveBeenCalledWith(entry.image, 300);
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
