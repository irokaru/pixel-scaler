import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ImageCheckList } from "@/@types/convert";
import { UnknownError } from "@/models/errors/UnknownError";
import useOutputPathStore from "@/stores/outputPathStore";
import { useScaledImageStore } from "@/stores/scaledImageStore";
import * as fileUtils from "@/utils/fileUtils";

import { createImageEntry } from "../helpers/imageTestHelper";

vi.mock("@/utils/fileUtils");

describe("scaledImageStore", () => {
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
      const store = useScaledImageStore();
      expect(store.entries).toEqual([]);
    });

    test("isEmpty should be true when no entries", () => {
      const store = useScaledImageStore();
      expect(store.isEmpty).toBe(true);
    });
  });

  describe("addEntry", () => {
    test("should add entry to the store", async () => {
      const store = useScaledImageStore();
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);

      store.addEntry(entry);

      expect(store.entries).toHaveLength(1);
      expect(store.entries[0]).toStrictEqual(entry);
      expect(store.isEmpty).toBe(false);
    });

    test("should add multiple entries", async () => {
      const store = useScaledImageStore();
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

  describe("removeEntry", () => {
    test("should remove entry by uuid", async () => {
      const store = useScaledImageStore();
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);
      store.addEntry(entry);

      const uuid = entry.image.uuid;
      store.removeEntry(uuid);

      expect(store.entries).toHaveLength(0);
    });

    test("should revoke object URL when removing", async () => {
      const store = useScaledImageStore();
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);
      store.addEntry(entry);
      const revokeSpy = vi.spyOn(URL, "revokeObjectURL");

      store.removeEntry(entry.image.uuid);

      expect(revokeSpy).toHaveBeenCalledWith(entry.image.url);
    });

    test("should do nothing if uuid not found", () => {
      const store = useScaledImageStore();

      expect(() => store.removeEntry("non-existent-uuid")).not.toThrowError();
      expect(store.entries).toHaveLength(0);
    });
  });

  describe("clearEntryErrors", () => {
    test("should clear errors of specified entry", async () => {
      const store = useScaledImageStore();
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);
      entry.errors = [
        {
          uuid: "error-1",
          code: "too-large-scale",
          params: {},
          kind: "scale",
        },
      ];
      store.addEntry(entry);

      store.clearEntryErrors(entry.image.uuid);

      expect(store.entries[0].errors).toHaveLength(0);
    });

    test("should do nothing if uuid not found", () => {
      const store = useScaledImageStore();

      expect(() =>
        store.clearEntryErrors("non-existent-uuid"),
      ).not.toThrowError();
    });
  });

  describe("downloadEntry", () => {
    test("should download entry by uuid", async () => {
      const store = useScaledImageStore();
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

    test("should throw UnknownError if uuid not found", () => {
      const store = useScaledImageStore();

      expect(() => store.downloadEntry("non-existent-uuid")).toThrowError(
        UnknownError,
      );
    });
  });

  describe("deleteCheckedEntries", () => {
    test("should delete checked entries", async () => {
      const store = useScaledImageStore();
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      const entry3 = await createImageEntry();
      revokeUrls.push(entry1.image.url, entry2.image.url, entry3.image.url);
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
      const store = useScaledImageStore();
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);
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
      const store = useScaledImageStore();
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
      const store = useScaledImageStore();
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

  describe("clearAll", () => {
    test("should clear all entries", async () => {
      const store = useScaledImageStore();
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      revokeUrls.push(entry1.image.url, entry2.image.url);
      store.addEntry(entry1);
      store.addEntry(entry2);

      store.clearAll();

      expect(store.entries).toHaveLength(0);
      expect(store.isEmpty).toBe(true);
    });

    test("should revoke all object URLs", async () => {
      const store = useScaledImageStore();
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      revokeUrls.push(entry1.image.url, entry2.image.url);
      store.addEntry(entry1);
      store.addEntry(entry2);
      const revokeSpy = vi.spyOn(URL, "revokeObjectURL");

      store.clearAll();

      expect(revokeSpy).toHaveBeenCalledTimes(2);
    });
  });
});
