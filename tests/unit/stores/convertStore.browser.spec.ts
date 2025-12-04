import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { ImageCheckList } from "@/@types/convert";
import { ScaleMode } from "@/constants/form";
import * as convertService from "@/core/services/image/convertService";
import { ScaleError } from "@/models/errors/ScaleError";
import { useConvertStore } from "@/stores/convertStore";
import { useErrorStore } from "@/stores/errorStore";
import { useInputImageStore } from "@/stores/inputImageStore";
import { useScaledImageStore } from "@/stores/scaledImageStore";

import { createImageEntry } from "../../utils/imageTestHelper";

vi.mock("@/core/services/image/convertService");

describe("convertStore", () => {
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

  describe("convertOne", () => {
    test("should convert entry and add to scaled store", async () => {
      const convertStore = useConvertStore();
      const scaledImageStore = useScaledImageStore();
      const entry = await createImageEntry();
      const scaledEntry = await createImageEntry();
      revokeUrls.push(entry.image.url, scaledEntry.image.url);
      const scaledImageData = scaledEntry.image;

      vi.spyOn(convertService, "isDuplicateEntry").mockReturnValue(false);
      vi.spyOn(convertService, "convertImage").mockResolvedValue(
        scaledImageData,
      );

      await convertStore.convertOne(entry);

      expect(scaledImageStore.entries).toHaveLength(1);
      expect(scaledImageStore.entries[0].image).toStrictEqual(scaledImageData);
    });

    test("should handle duplicate entry error", async () => {
      const convertStore = useConvertStore();
      const scaledImageStore = useScaledImageStore();
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);
      entry.settings = { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth };

      vi.spyOn(convertService, "isDuplicateEntry").mockReturnValue(true);

      await convertStore.convertOne(entry);

      expect(scaledImageStore.entries).toHaveLength(0);
      expect(entry.errors).toHaveLength(1);
      expect(entry.errors[0].code).toBe(
        "error.scale.duplicate-image-and-settings",
      );
    });

    test("should handle conversion errors", async () => {
      const convertStore = useConvertStore();
      const errorStore = useErrorStore();
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);
      const error = new Error("Conversion failed");

      vi.spyOn(convertService, "isDuplicateEntry").mockReturnValue(false);
      vi.spyOn(convertService, "convertImage").mockRejectedValue(error);

      await convertStore.convertOne(entry);

      expect(errorStore.errors).toHaveLength(1);
      expect(errorStore.errors[0].kind).toBe("unknown");
    });

    test("should add ScaleError to entry errors", async () => {
      const convertStore = useConvertStore();
      const entry = await createImageEntry();
      revokeUrls.push(entry.image.url);
      const scaleError = new ScaleError("invalid-image-size", {
        filename: "test.png",
        originalPixelSize: 1,
      });

      vi.spyOn(convertService, "isDuplicateEntry").mockReturnValue(false);
      vi.spyOn(convertService, "convertImage").mockRejectedValue(scaleError);

      await convertStore.convertOne(entry);

      expect(entry.errors).toHaveLength(1);
      expect(entry.errors[0].code).toBe("error.scale.invalid-image-size");
    });
  });

  describe("convertOneByUuid", () => {
    test("should convert entry by uuid", async () => {
      const convertStore = useConvertStore();
      const inputImageStore = useInputImageStore();
      const scaledImageStore = useScaledImageStore();
      const entry = await createImageEntry();
      const scaledEntry = await createImageEntry();
      revokeUrls.push(entry.image.url, scaledEntry.image.url);
      inputImageStore.addEntry(entry);
      const scaledImageData = scaledEntry.image;

      vi.spyOn(convertService, "isDuplicateEntry").mockReturnValue(false);
      vi.spyOn(convertService, "convertImage").mockResolvedValue(
        scaledImageData,
      );

      await convertStore.convertOneByUuid(entry.image.uuid);

      expect(scaledImageStore.entries).toHaveLength(1);
    });

    test("should do nothing if uuid not found", async () => {
      const convertStore = useConvertStore();
      const scaledImageStore = useScaledImageStore();

      await convertStore.convertOneByUuid("non-existent-uuid");

      expect(scaledImageStore.entries).toHaveLength(0);
    });
  });

  describe("convertAnyChecked", () => {
    test("should convert all checked entries", async () => {
      const convertStore = useConvertStore();
      const inputImageStore = useInputImageStore();
      const scaledImageStore = useScaledImageStore();
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      const entry3 = await createImageEntry();
      const scaledEntry = await createImageEntry();
      revokeUrls.push(
        entry1.image.url,
        entry2.image.url,
        entry3.image.url,
        scaledEntry.image.url,
      );
      inputImageStore.addEntry(entry1);
      inputImageStore.addEntry(entry2);
      inputImageStore.addEntry(entry3);
      const scaledImageData = scaledEntry.image;

      vi.spyOn(convertService, "isDuplicateEntry").mockReturnValue(false);
      vi.spyOn(convertService, "convertImage").mockResolvedValue(
        scaledImageData,
      );

      const checkedList: ImageCheckList = {
        [entry1.image.uuid]: true,
        [entry2.image.uuid]: false,
        [entry3.image.uuid]: true,
      };

      await convertStore.convertAnyChecked(checkedList);

      expect(scaledImageStore.entries).toHaveLength(2);
    });

    test("should handle errors for individual entries", async () => {
      const convertStore = useConvertStore();
      const inputImageStore = useInputImageStore();
      const scaledImageStore = useScaledImageStore();
      const entry1 = await createImageEntry();
      const entry2 = await createImageEntry();
      const scaledEntry = await createImageEntry();
      revokeUrls.push(
        entry1.image.url,
        entry2.image.url,
        scaledEntry.image.url,
      );
      inputImageStore.addEntry(entry1);
      inputImageStore.addEntry(entry2);
      const scaledImageData = scaledEntry.image;

      vi.spyOn(convertService, "isDuplicateEntry").mockReturnValue(false);
      const convertImageSpy = vi
        .spyOn(convertService, "convertImage")
        .mockResolvedValueOnce(scaledImageData)
        .mockRejectedValueOnce(new Error("Conversion failed"));

      const checkedList: ImageCheckList = {
        [entry1.image.uuid]: true,
        [entry2.image.uuid]: true,
      };

      await convertStore.convertAnyChecked(checkedList);

      expect(scaledImageStore.entries).toHaveLength(1);
      expect(convertImageSpy).toHaveBeenCalledTimes(2);
    });
  });
});
