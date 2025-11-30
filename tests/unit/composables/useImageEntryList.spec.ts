import { createPinia, setActivePinia } from "pinia";

vi.mock("@/models/InputImageData");

import useImageEntryList from "@/composables/useImageEntryList";
import { ScaleMode } from "@/constants/form";
import { InputError } from "@/models/errors/InputError";
import { PSImageData } from "@/models/InputImageData";
import useImageEntryStore from "@/stores/imageEntryStore";
import useOutputPathStore from "@/stores/outputPathStore";
import * as fileUtils from "@/utils/fileUtils";

import { dummyImageEntry } from "../__mocks__/models/InputImageData";

const downloadStringMock = vi.spyOn(fileUtils, "downloadString");

describe("useImageEntryList", () => {
  let store: ReturnType<typeof useImageEntryStore>;
  let outputPathStore: ReturnType<typeof useOutputPathStore>;
  let entryList: ReturnType<typeof useImageEntryList>;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    store = useImageEntryStore();
    outputPathStore = useOutputPathStore();
    entryList = useImageEntryList("input");
  });

  describe("addFileToImageEntryList", () => {
    test("should add a file to the image entry list", async () => {
      const file = new File([""], "test.png", { type: "image/png" });
      const opts = {
        originalPixelSize: 1,
        scaleSizePercent: 100,
        scaleMode: ScaleMode.Smooth,
      };

      await entryList.addFileToImageEntryList(file, opts);

      expect(store.imageEntryList).toHaveLength(1);
      expect(store.imageEntryList[0].image.data.name).toBe("test.png");
      expect(store.imageEntryList[0].errors).toHaveLength(0);
    });

    test("should handle errors when adding a same file", async () => {
      const file = new File([""], "test.png", { type: "image/png" });
      const opts = {
        originalPixelSize: 1,
        scaleSizePercent: 100,
        scaleMode: ScaleMode.Smooth,
      };

      await entryList.addFileToImageEntryList(file, opts);
      expect(store.errors).toHaveLength(0);

      await entryList.addFileToImageEntryList(file, opts);
      expect(store.errors).toHaveLength(1);
      expect(store.errors[0].code).toBe("error.file.duplicate-image");
    });

    test("should handle CustomError", async () => {
      const file = new File([""], "test.png", { type: "image/png" });
      const opts = {
        originalPixelSize: 1,
        scaleSizePercent: 100,
        scaleMode: ScaleMode.Smooth,
      };

      const spyInit = vi
        .spyOn(PSImageData, "init")
        .mockRejectedValueOnce(
          new InputError("canvas-is-unsupported", { filename: file.name }),
        );

      await entryList.addFileToImageEntryList(file, opts);
      expect(store.errors).toHaveLength(1);
      expect(store.errors[0].code).toBe("error.input.canvas-is-unsupported");

      spyInit.mockRestore();
    });

    test("should handle unknown error", async () => {
      const file = new File([""], "test.png", { type: "image/png" });
      const opts = {
        originalPixelSize: 1,
        scaleSizePercent: 100,
        scaleMode: ScaleMode.Smooth,
      };

      const spyInit = vi
        .spyOn(PSImageData, "init")
        .mockRejectedValueOnce(new Error("this is an unknown error"));

      await entryList.addFileToImageEntryList(file, opts);
      expect(store.errors).toHaveLength(1);
      expect(store.errors[0].code).toBe("error.unknown.unknown");
      expect(store.errors[0].params).toHaveProperty("message");

      spyInit.mockRestore();
    });
  });

  describe("clearErrorsOneEntry", () => {
    test("should clear errors for a specific entry", async () => {
      const entry1 = await dummyImageEntry({
        errors: [
          {
            kind: "scale",
            code: "error.scale.invalid-image-size",
            params: {
              filename: "test.png",
              originalPixelSize: -1,
            },
          },
        ],
      });
      const entry2 = await dummyImageEntry();

      store.imageEntryList.push(entry1, entry2);

      expect(store.imageEntryList[0].errors).toHaveLength(1);
      entryList.clearErrorsOneEntry(store.imageEntryList[0].image.uuid);
      expect(store.imageEntryList[0].errors).toHaveLength(0);
    });

    test("should not clear errors if entry not found", async () => {
      const entry1 = await dummyImageEntry();
      const entry2 = await dummyImageEntry();

      store.imageEntryList.push(entry1, entry2);

      entryList.clearErrorsOneEntry("non-existent-uuid");

      expect(store.imageEntryList[0].errors).toHaveLength(0);
    });
  });

  describe("deleteOne", () => {
    test("should delete a specific entry", async () => {
      const entry1 = await dummyImageEntry();
      const entry2 = await dummyImageEntry();

      store.imageEntryList.push(entry1, entry2);

      expect(store.imageEntryList).toHaveLength(2);
      entryList.deleteOne(store.imageEntryList[0].image.uuid);
      expect(store.imageEntryList).toHaveLength(1);
    });

    test("should not delete if entry not found", async () => {
      const entry1 = await dummyImageEntry();
      const entry2 = await dummyImageEntry();

      store.imageEntryList.push(entry1, entry2);

      expect(store.imageEntryList).toHaveLength(2);
      entryList.deleteOne("non-existent-uuid");
      expect(store.imageEntryList).toHaveLength(2);
    });
  });

  describe("downloadOne", () => {
    test("should download a specific entry", async () => {
      const entry1 = await dummyImageEntry();
      const entry2 = await dummyImageEntry();

      store.imageEntryList.push(entry1, entry2);

      downloadStringMock.mockImplementation(() => Promise.resolve());

      entryList.downloadOne(store.imageEntryList[0].image.uuid);
      expect(downloadStringMock).toHaveBeenCalledWith(
        store.imageEntryList[0].image.url,
        store.imageEntryList[0].image.data.name,
        outputPathStore.outputPath,
      );

      downloadStringMock.mockRestore();
    });

    test("should not download if entry not found", async () => {
      const entry1 = await dummyImageEntry();
      const entry2 = await dummyImageEntry();

      store.imageEntryList.push(entry1, entry2);

      downloadStringMock.mockImplementation(() => Promise.resolve());

      entryList.downloadOne("non-existent-uuid");
      expect(downloadStringMock).not.toHaveBeenCalled();

      downloadStringMock.mockRestore();
    });
  });

  describe("isImageEntryListEmpty", async () => {
    test.each<{
      description: string;
      imageEntryList: Awaited<ReturnType<typeof dummyImageEntry>>[];
      expected: boolean;
    }>([
      { description: "empty list", imageEntryList: [], expected: true },
      {
        description: "non-empty list",
        imageEntryList: [await dummyImageEntry()],
        expected: false,
      },
    ])("should return $description", ({ imageEntryList, expected }) => {
      store.imageEntryList = imageEntryList;

      expect(entryList.isImageEntryListEmpty()).toBe(expected);
    });
  });
});
