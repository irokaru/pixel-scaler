import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ImageCheckList } from "@/@types/convert";
import { ScaleMode } from "@/constants/form";
import { FileError } from "@/models/errors/FileError";
import { useInputImageStore } from "@/stores/inputImageStore";
import useOutputPathStore from "@/stores/outputPathStore";
import * as fileUtils from "@/utils/fileUtils";

import {
  create1pxPngFile,
  createImageEntry,
} from "../../utils/imageTestHelper";

vi.mock("@/utils/fileUtils");

describe("inputImageStore", () => {
  let revokeUrls: string[] = [];

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    revokeUrls = [];
  });

  afterEach(() => {
    for (const url of revokeUrls) {
      URL.revokeObjectURL(url);
    }
  });

  describe("initial state", () => {
    test("should have empty entries array", () => {
      const store = useInputImageStore();
      expect(store.entries).toEqual([]);
    });

    test("isEmpty should be true when no entries", () => {
      const store = useInputImageStore();
      expect(store.isEmpty).toBe(true);
    });
  });

  describe("addEntry", () => {
    test("should add entry to the store", async () => {
      const store = useInputImageStore();
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);

      store.addEntry(entry);

      expect(store.entries).toHaveLength(1);
      expect(store.entries[0]).toStrictEqual(entry);
      expect(store.isEmpty).toBe(false);
    });

    test("should add multiple entries", async () => {
      const store = useInputImageStore();
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      revokeUrls.push(entry1.image.url, entry2.image.url);

      store.addEntry(entry1);
      store.addEntry(entry2);

      expect(store.entries).toHaveLength(2);
      expect(store.entries[0]).toStrictEqual(entry1);
      expect(store.entries[1]).toStrictEqual(entry2);
    });
  });

  describe("addEntryFromFile", () => {
    test("should create entry from file and add it", async () => {
      const store = useInputImageStore();
      const file = create1pxPngFile();
      const opts = {
        originalPixelSize: 1,
        scaleSizePercent: 200,
        scaleMode: ScaleMode.Smooth,
      };

      await store.addEntryFromFile(file, opts);
      revokeUrls.push(store.entries[0].image.url);

      expect(store.entries).toHaveLength(1);
      expect(store.entries[0].image.data).toBe(file);
      expect(store.entries[0].settings.scaleSizePercent).toBe(200);
    });

    test("should throw FileError when duplicate URL", async () => {
      const store = useInputImageStore();
      const file = create1pxPngFile();
      const opts = {
        originalPixelSize: 1,
        scaleSizePercent: 200,
        scaleMode: ScaleMode.Smooth,
      };

      await store.addEntryFromFile(file, opts);
      revokeUrls.push(store.entries[0].image.url);

      await expect(store.addEntryFromFile(file, opts)).rejects.toThrowError(
        FileError,
      );
    });
  });

  describe("removeEntry", () => {
    test("should remove entry by uuid", async () => {
      const store = useInputImageStore();
      const entry = await createImageEntry();
      store.addEntry(entry);

      const uuid = entry.image.uuid;
      store.removeEntry(uuid);

      expect(store.entries).toHaveLength(0);
    });

    test("should revoke object URL when removing", async () => {
      const store = useInputImageStore();
      const entry = await createImageEntry();
      store.addEntry(entry);
      const revokeSpy = vi.spyOn(URL, "revokeObjectURL");

      store.removeEntry(entry.image.uuid);

      expect(revokeSpy).toHaveBeenCalledWith(entry.image.url);
    });

    test("should do nothing if uuid not found", () => {
      const store = useInputImageStore();

      expect(() => store.removeEntry("non-existent-uuid")).not.toThrowError();
      expect(store.entries).toHaveLength(0);
    });
  });

  describe("clearEntryErrors", () => {
    test("should clear errors of specified entry", async () => {
      const store = useInputImageStore();
      const entry = await createImageEntry();
      entry.errors = [
        {
          uuid: "error-1",
          code: "too-large-scale",
          params: {},
          kind: "scale",
        },
      ];
      revokeUrls.push(entry.image.url);
      store.addEntry(entry);

      store.clearEntryErrors(entry.image.uuid);

      expect(store.entries[0].errors).toHaveLength(0);
    });

    test("should do nothing if uuid not found", () => {
      const store = useInputImageStore();

      expect(() =>
        store.clearEntryErrors("non-existent-uuid"),
      ).not.toThrowError();
    });
  });

  describe("downloadEntry", () => {
    test("should download entry by uuid", async () => {
      const store = useInputImageStore();
      const outputPathStore = useOutputPathStore();
      outputPathStore.outputPath = "/output";
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);
      store.addEntry(entry);
      const downloadStringSpy = vi.spyOn(fileUtils, "downloadString");

      store.downloadEntry(entry.image.uuid);

      expect(downloadStringSpy).toHaveBeenCalledWith(
        entry.image.url,
        entry.image.data.name,
        "/output",
      );
    });

    test("should do nothing if uuid not found", () => {
      const store = useInputImageStore();

      expect(() => store.downloadEntry("non-existent-uuid")).not.toThrowError();
    });
  });

  describe("deleteCheckedEntries", () => {
    test("should delete checked entries", async () => {
      const store = useInputImageStore();
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      const entry3 = await createImageEntry();
      revokeUrls.push(entry2.image.url);
      store.addEntry(entry1);
      store.addEntry(entry2);
      store.addEntry(entry3);

      const checkedList: ImageCheckList = {
        [entry1.image.uuid]: true,
        [entry2.image.uuid]: false,
        [entry3.image.uuid]: true,
      };

      store.deleteCheckedEntries(checkedList);

      expect(store.entries).toHaveLength(1);
      expect(store.entries[0]).toStrictEqual(entry2);
    });

    test("should revoke object URLs of deleted entries", async () => {
      const store = useInputImageStore();
      const entry = await createImageEntry();
      store.addEntry(entry);
      const revokeSpy = vi.spyOn(URL, "revokeObjectURL");

      const checkedList: ImageCheckList = {
        [entry.image.uuid]: true,
      };

      store.deleteCheckedEntries(checkedList);

      expect(revokeSpy).toHaveBeenCalledWith(entry.image.url);
    });
  });

  describe("downloadCheckedEntries", () => {
    test("should download all checked entries", async () => {
      const store = useInputImageStore();
      const outputPathStore = useOutputPathStore();
      outputPathStore.outputPath = "/output";
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      revokeUrls.push(entry1.image.url, entry2.image.url);
      store.addEntry(entry1);
      store.addEntry(entry2);
      const downloadStringSpy = vi.spyOn(fileUtils, "downloadString");

      const checkedList: ImageCheckList = {
        [entry1.image.uuid]: true,
        [entry2.image.uuid]: true,
      };

      store.downloadCheckedEntries(checkedList);

      expect(downloadStringSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("downloadCheckedEntriesZip", () => {
    test("should create zip and download", async () => {
      const store = useInputImageStore();
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);
      store.addEntry(entry);
      const zipBlob = new Blob();
      const createZipSpy = vi
        .spyOn(fileUtils, "createZipBlobFromScaledImages")
        .mockResolvedValue(zipBlob);
      const downloadBlobSpy = vi.spyOn(fileUtils, "downloadBlob");

      const checkedList: ImageCheckList = {
        [entry.image.uuid]: true,
      };

      await store.downloadCheckedEntriesZip(checkedList);

      expect(createZipSpy).toHaveBeenCalled();
      expect(downloadBlobSpy).toHaveBeenCalledWith(zipBlob, "images.zip");
    });
  });

  describe("applySettingsToCheckedEntries", () => {
    test("should apply settings to checked entries", async () => {
      const store = useInputImageStore();
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      entry1.settings = { scaleSizePercent: 100, scaleMode: ScaleMode.Smooth };
      entry2.settings = { scaleSizePercent: 100, scaleMode: ScaleMode.Smooth };
      revokeUrls.push(entry1.image.url, entry2.image.url);
      store.addEntry(entry1);
      store.addEntry(entry2);

      const checkedList: ImageCheckList = {
        [entry1.image.uuid]: true,
        [entry2.image.uuid]: false,
      };

      store.applySettingsToCheckedEntries(checkedList, {
        scaleSizePercent: 200,
        scaleMode: ScaleMode.Nearest,
        originalPixelSize: 1,
      });

      expect(store.entries[0].settings.scaleSizePercent).toBe(200);
      expect(store.entries[0].settings.scaleMode).toBe(ScaleMode.Nearest);
      expect(store.entries[1].settings.scaleSizePercent).toBe(100);
      expect(store.entries[1].settings.scaleMode).toBe(ScaleMode.Smooth);
    });
  });

  describe("clearAll", () => {
    test("should clear all entries", async () => {
      const store = useInputImageStore();
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      store.addEntry(entry1);
      store.addEntry(entry2);

      store.clearAll();

      expect(store.entries).toHaveLength(0);
      expect(store.isEmpty).toBe(true);
    });

    test("should revoke all object URLs", async () => {
      const store = useInputImageStore();
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      store.addEntry(entry1);
      store.addEntry(entry2);
      const revokeSpy = vi.spyOn(URL, "revokeObjectURL");

      store.clearAll();

      expect(revokeSpy).toHaveBeenCalledTimes(2);
    });
  });
});
