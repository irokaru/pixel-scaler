vi.mock("@/models/InputImageData");

import { ScaleMode } from "@/constants/form";
import {
  createImageEntry,
  isDuplicateUrl,
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

  describe("isDuplicateUrl", () => {
    test("returns true when URL exists in list", async () => {
      const existingEntry = await dummyImageEntry({
        image: { url: "blob:http://example.com/test" },
      });
      const entries = [existingEntry];

      const result = isDuplicateUrl("blob:http://example.com/test", entries);

      expect(result).toBe(true);
    });

    test("returns false when URL does not exist in list", async () => {
      const existingEntry = await dummyImageEntry({
        image: { url: "blob:http://example.com/test1" },
      });
      const entries = [existingEntry];

      const result = isDuplicateUrl("blob:http://example.com/test2", entries);

      expect(result).toBe(false);
    });

    test("returns false for empty list", () => {
      const result = isDuplicateUrl("blob:http://example.com/test", []);

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
