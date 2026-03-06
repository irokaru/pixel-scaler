vi.mock("@/core/models/InputImageData");

import { ScaleMode } from "@/constants/form";
import {
  createImageEntry,
  isDuplicateFileName,
  findEntryByUuid,
} from "@/core/services/image/entryService";

import { dummyImageEntry } from "../../../__mocks__/models/InputImageData";

describe("entryService", () => {
  describe("createImageEntry", () => {
    test("creates an ImageEntry from a File", async () => {
      const file = new File([], "test.png", { type: "image/png" });
      const opts = {
        originalPixelSize: 100,
        scaleSizePercent: 200,
        scaleMode: ScaleMode.Smooth,
      };

      const entry = await createImageEntry(file, opts);

      expect(entry.image.data.name).toBe("test.png");
      expect(entry.image.originalPixelSize).toBe(100);
      expect(entry.settings.scaleSizePercent).toBe(200);
      expect(entry.settings.scaleMode).toBe(ScaleMode.Smooth);
      expect(entry.errors).toEqual([]);
    });

    test("sets originalPixelSize on the image data", async () => {
      const file = new File([], "test.png", { type: "image/png" });
      const opts = {
        originalPixelSize: 50,
        scaleSizePercent: 300,
        scaleMode: ScaleMode.Nearest,
      };

      const entry = await createImageEntry(file, opts);

      expect(entry.image.originalPixelSize).toBe(50);
    });
  });

  describe("isDuplicateFileName", () => {
    test("returns true when file name exists in list", async () => {
      const existingEntry = await dummyImageEntry({
        image: { data: new File([], "duplicate.png") },
      });
      const entries = [existingEntry];

      const result = isDuplicateFileName("duplicate.png", entries);

      expect(result).toBe(true);
    });

    test("returns false when file name does not exist in list", async () => {
      const existingEntry = await dummyImageEntry({
        image: { data: new File([], "image1.png") },
      });
      const entries = [existingEntry];

      const result = isDuplicateFileName("image2.png", entries);

      expect(result).toBe(false);
    });

    test("returns false for empty list", () => {
      const result = isDuplicateFileName("test.png", []);

      expect(result).toBe(false);
    });
  });

  describe("findEntryByUuid", () => {
    test("finds entry by UUID", async () => {
      const entry1 = await dummyImageEntry({ image: { uuid: "uuid-1" } });
      const entry2 = await dummyImageEntry({ image: { uuid: "uuid-2" } });
      const entries = [entry1, entry2];

      const result = findEntryByUuid("uuid-2", entries);

      expect(result).toBe(entry2);
    });

    test("returns undefined when UUID not found", async () => {
      const entry1 = await dummyImageEntry({ image: { uuid: "uuid-1" } });
      const entries = [entry1];

      const result = findEntryByUuid("uuid-999", entries);

      expect(result).toBeUndefined();
    });

    test("returns undefined for empty list", () => {
      const result = findEntryByUuid("uuid-1", []);

      expect(result).toBeUndefined();
    });
  });
});
