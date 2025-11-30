import { setActivePinia, createPinia } from "pinia";

vi.mock("@/models/InputImageData");

vi.mock("@/utils/fileUtils", () => ({
  downloadBlob: vi.fn(),
  downloadString: vi.fn(),
  createZipBlobFromScaledImages: vi.fn().mockResolvedValue(new Blob()),
}));

vi.mock("@/core/services/image/entryBatchService", async () => {
  const actual = await vi.importActual(
    "@/core/services/image/entryBatchService",
  );
  return {
    ...actual,
    revokeEntryUrls: vi.fn(),
  };
});

import { ImageCheckList } from "@/@types/convert";
import useImageEntryCheckedOperation from "@/composables/useImageEntryCheckedOperation";
import * as entryBatchService from "@/core/services/image/entryBatchService";
import useImageEntryStore from "@/stores/imageEntryStore";
import useOutputPathStore from "@/stores/outputPathStore";
import * as fileUtils from "@/utils/fileUtils";

import { dummyImageEntry } from "../__mocks__/models/InputImageData";

const downloadBlobMock = fileUtils.downloadBlob as ReturnType<typeof vi.fn>;
const downloadStringMock = fileUtils.downloadString as ReturnType<typeof vi.fn>;
const createZipBlobFromScaledImagesMock =
  fileUtils.createZipBlobFromScaledImages as ReturnType<typeof vi.fn>;
const revokeEntryUrlsMock = entryBatchService.revokeEntryUrls as ReturnType<
  typeof vi.fn
>;

describe("useImageEntryCheckedOperation", () => {
  let store: ReturnType<typeof useImageEntryStore>;
  let outputPathStore: ReturnType<typeof useOutputPathStore>;
  let operation: ReturnType<typeof useImageEntryCheckedOperation>;

  beforeEach(async () => {
    setActivePinia(createPinia());
    vi.clearAllMocks();

    store = useImageEntryStore();
    outputPathStore = useOutputPathStore();
    operation = useImageEntryCheckedOperation("input");

    // Add mock image entries to the store
    const mockEntries = await Promise.all([
      dummyImageEntry(),
      dummyImageEntry(),
      dummyImageEntry(),
    ]);

    for (const entry of mockEntries) {
      store.imageEntryList.push(entry);
    }
  });

  describe("deleteAnyChecked", () => {
    test("delete checked items", () => {
      const checkList: ImageCheckList = {
        [store.imageEntryList[0].image.uuid]: true,
        [store.imageEntryList[1].image.uuid]: false,
        [store.imageEntryList[2].image.uuid]: false,
      };

      operation.deleteAnyChecked(checkList);

      expect(revokeEntryUrlsMock).toHaveBeenCalledTimes(1);
      expect(revokeEntryUrlsMock.mock.calls[0][0]).toHaveLength(1);
      expect(store.imageEntryList).toHaveLength(2);
    });

    test("delete all when all unchecked", () => {
      const checkList: ImageCheckList = {
        [store.imageEntryList[0].image.uuid]: false,
        [store.imageEntryList[1].image.uuid]: false,
        [store.imageEntryList[2].image.uuid]: false,
      };

      operation.deleteAnyChecked(checkList);

      expect(revokeEntryUrlsMock).toHaveBeenCalledTimes(1);
      expect(revokeEntryUrlsMock.mock.calls[0][0]).toHaveLength(3);
      expect(store.imageEntryList).toHaveLength(0);
    });

    test("delete all when all checked", () => {
      const checkList: ImageCheckList = {
        [store.imageEntryList[0].image.uuid]: true,
        [store.imageEntryList[1].image.uuid]: true,
        [store.imageEntryList[2].image.uuid]: true,
      };

      operation.deleteAnyChecked(checkList);

      expect(revokeEntryUrlsMock).toHaveBeenCalledTimes(1);
      expect(revokeEntryUrlsMock.mock.calls[0][0]).toHaveLength(3);
      expect(store.imageEntryList).toHaveLength(0);
    });
  });

  describe("downloadAnyChecked", () => {
    const OutputPath = "/output/path";

    test("download checked items", () => {
      const checkList: ImageCheckList = {
        [store.imageEntryList[0].image.uuid]: true,
        [store.imageEntryList[1].image.uuid]: false,
        [store.imageEntryList[2].image.uuid]: false,
      };

      outputPathStore.outputPath = OutputPath;
      operation.downloadAnyChecked(checkList);

      expect(downloadStringMock).toHaveBeenCalledTimes(1);
      for (const call of downloadStringMock.mock.calls) {
        expect(call[2]).toBe(OutputPath);
      }
    });

    test("download all when all unchecked", () => {
      const checkList: ImageCheckList = {
        [store.imageEntryList[0].image.uuid]: false,
        [store.imageEntryList[1].image.uuid]: false,
        [store.imageEntryList[2].image.uuid]: false,
      };

      outputPathStore.outputPath = OutputPath;
      operation.downloadAnyChecked(checkList);

      expect(downloadStringMock).toHaveBeenCalledTimes(3);
      for (const call of downloadStringMock.mock.calls) {
        expect(call[2]).toBe(OutputPath);
      }
    });

    test("download all when all checked", () => {
      const checkList: ImageCheckList = {
        [store.imageEntryList[0].image.uuid]: true,
        [store.imageEntryList[1].image.uuid]: true,
        [store.imageEntryList[2].image.uuid]: true,
      };

      outputPathStore.outputPath = OutputPath;
      operation.downloadAnyChecked(checkList);

      expect(downloadStringMock).toHaveBeenCalledTimes(3);
      for (const call of downloadStringMock.mock.calls) {
        expect(call[2]).toBe(OutputPath);
      }
    });
  });

  describe("downloadAnyCheckedZip", () => {
    test("download checked items", async () => {
      const checkList: ImageCheckList = {
        [store.imageEntryList[0].image.uuid]: true,
        [store.imageEntryList[1].image.uuid]: false,
        [store.imageEntryList[2].image.uuid]: false,
      };

      createZipBlobFromScaledImagesMock.mockResolvedValue(new Blob());
      await operation.downloadAnyCheckedZip(checkList);

      expect(createZipBlobFromScaledImagesMock).toHaveBeenCalledTimes(1);
      expect(createZipBlobFromScaledImagesMock.mock.calls[0][0]).toHaveLength(
        1,
      );
      expect(downloadBlobMock).toHaveBeenCalledTimes(1);
      expect(downloadBlobMock.mock.calls[0]).toEqual([
        expect.any(Blob),
        "images.zip",
      ]);
    });

    test("download all when all unchecked", async () => {
      const checkList: ImageCheckList = {
        [store.imageEntryList[0].image.uuid]: false,
        [store.imageEntryList[1].image.uuid]: false,
        [store.imageEntryList[2].image.uuid]: false,
      };

      createZipBlobFromScaledImagesMock.mockResolvedValue(new Blob());
      await operation.downloadAnyCheckedZip(checkList);

      expect(createZipBlobFromScaledImagesMock).toHaveBeenCalledTimes(1);
      expect(createZipBlobFromScaledImagesMock.mock.calls[0][0]).toHaveLength(
        3,
      );
      expect(downloadBlobMock).toHaveBeenCalledTimes(1);
      expect(downloadBlobMock.mock.calls[0]).toEqual([
        expect.any(Blob),
        "images.zip",
      ]);
    });

    test("download all when all checked", async () => {
      const checkList: ImageCheckList = {
        [store.imageEntryList[0].image.uuid]: true,
        [store.imageEntryList[1].image.uuid]: true,
        [store.imageEntryList[2].image.uuid]: true,
      };

      createZipBlobFromScaledImagesMock.mockResolvedValue(new Blob());
      await operation.downloadAnyCheckedZip(checkList);

      expect(createZipBlobFromScaledImagesMock).toHaveBeenCalledTimes(1);
      expect(createZipBlobFromScaledImagesMock.mock.calls[0][0]).toHaveLength(
        3,
      );
      expect(downloadBlobMock).toHaveBeenCalledTimes(1);
      expect(downloadBlobMock.mock.calls[0]).toEqual([
        expect.any(Blob),
        "images.zip",
      ]);
    });
  });
});
