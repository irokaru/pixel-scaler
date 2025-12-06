vi.mock("@/models/InputImageData");

import { ImageCheckList } from "@/@types/convert";
import {
  filterEntriesByChecked,
  getUncheckedEntries,
  revokeEntryUrls,
} from "@/core/services/image/entryBatchService";

import { dummyImageEntry } from "../../../__mocks__/models/InputImageData";

describe("entryBatchService", () => {
  describe("filterEntriesByChecked", () => {
    test("returns all entries when all unchecked", async () => {
      const entry1 = await dummyImageEntry({ image: { uuid: "uuid-1" } });
      const entry2 = await dummyImageEntry({ image: { uuid: "uuid-2" } });
      const entries = [entry1, entry2];
      const checkedMap: ImageCheckList = {
        "uuid-1": false,
        "uuid-2": false,
      };

      const result = filterEntriesByChecked(entries, checkedMap);

      expect(result).toEqual(entries);
      expect(result.length).toBe(2);
    });

    test("returns only checked entries", async () => {
      const entry1 = await dummyImageEntry({ image: { uuid: "uuid-1" } });
      const entry2 = await dummyImageEntry({ image: { uuid: "uuid-2" } });
      const entry3 = await dummyImageEntry({ image: { uuid: "uuid-3" } });
      const entries = [entry1, entry2, entry3];
      const checkedMap: ImageCheckList = {
        "uuid-1": true,
        "uuid-2": false,
        "uuid-3": true,
      };

      const result = filterEntriesByChecked(entries, checkedMap);

      expect(result.length).toBe(2);
      expect(result).toContain(entry1);
      expect(result).toContain(entry3);
      expect(result).not.toContain(entry2);
    });

    test("returns empty array when no entries checked", async () => {
      const entry1 = await dummyImageEntry({ image: { uuid: "uuid-1" } });
      const entries = [entry1];
      const checkedMap: ImageCheckList = {
        "uuid-1": false,
      };

      const result = filterEntriesByChecked(entries, checkedMap);

      expect(result).toEqual(entries);
    });
  });

  describe("getUncheckedEntries", () => {
    test("returns empty array when all unchecked", async () => {
      const entry1 = await dummyImageEntry({ image: { uuid: "uuid-1" } });
      const entry2 = await dummyImageEntry({ image: { uuid: "uuid-2" } });
      const entries = [entry1, entry2];
      const checkedMap: ImageCheckList = {
        "uuid-1": false,
        "uuid-2": false,
      };

      const result = getUncheckedEntries(entries, checkedMap);

      expect(result).toEqual([]);
    });

    test("returns only unchecked entries", async () => {
      const entry1 = await dummyImageEntry({ image: { uuid: "uuid-1" } });
      const entry2 = await dummyImageEntry({ image: { uuid: "uuid-2" } });
      const entry3 = await dummyImageEntry({ image: { uuid: "uuid-3" } });
      const entries = [entry1, entry2, entry3];
      const checkedMap: ImageCheckList = {
        "uuid-1": true,
        "uuid-2": false,
        "uuid-3": true,
      };

      const result = getUncheckedEntries(entries, checkedMap);

      expect(result.length).toBe(1);
      expect(result).toContain(entry2);
      expect(result).not.toContain(entry1);
      expect(result).not.toContain(entry3);
    });

    test("returns all entries when all checked", async () => {
      const entry1 = await dummyImageEntry({ image: { uuid: "uuid-1" } });
      const entry2 = await dummyImageEntry({ image: { uuid: "uuid-2" } });
      const entries = [entry1, entry2];
      const checkedMap: ImageCheckList = {
        "uuid-1": true,
        "uuid-2": true,
      };

      const result = getUncheckedEntries(entries, checkedMap);

      expect(result).toEqual([]);
    });
  });

  describe("revokeEntryUrls", () => {
    test("calls revokeObjectURL for each entry", async () => {
      const entry1 = await dummyImageEntry({
        image: { url: "blob:http://example.com/1" },
      });
      const entry2 = await dummyImageEntry({
        image: { url: "blob:http://example.com/2" },
      });
      const entries = [entry1, entry2];

      // Should not throw
      expect(() => revokeEntryUrls(entries)).not.toThrowError();
    });

    test("handles empty array", () => {
      expect(() => revokeEntryUrls([])).not.toThrowError();
    });

    test("continues on error", async () => {
      const entry1 = await dummyImageEntry({
        image: { url: "invalid-url" },
      });
      const entry2 = await dummyImageEntry({
        image: { url: "blob:http://example.com/2" },
      });
      const entries = [entry1, entry2];

      // Should not throw even if revokeObjectURL fails
      expect(() => revokeEntryUrls(entries)).not.toThrowError();
    });
  });
});
