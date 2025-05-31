import { ref } from "vue";

import { ImageEntry } from "@/@types/convert";
import { CustomErrorObject } from "@/@types/error";
import useImageEntryList from "@/composables/useImageEntryList";
import { ScaleMode } from "@/constants/form";
import { InputError } from "@/models/errors/InputError";
import { ScaleError } from "@/models/errors/ScaleError";
import { PSImageData } from "@/models/InputImageData";
import * as fileUtils from "@/utils/fileUtils";

import { dummyImageEntry } from "../__mocks__/models/InputImageData";

vi.mock("@/models/InputImageData");
const downloadStringMock = vi.spyOn(fileUtils, "downloadString");

describe("useImageEntryList", () => {
  describe("addFileToImageEntryList", () => {
    test("should add a file to the image entry list", async () => {
      const imageEntryListMock = ref<ImageEntry[]>([]);
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { addFileToImageEntryList } = useImageEntryList(
        imageEntryListMock,
        errorsMock,
      );

      const file = new File([""], "test.png", { type: "image/png" });
      const opts = {
        originalPixelSize: 1,
        scaleSizePercent: 100,
        scaleMode: ScaleMode.Smooth,
      };

      await addFileToImageEntryList(file, opts);

      expect(imageEntryListMock.value).toHaveLength(1);
      expect(imageEntryListMock.value[0].image.data.name).toBe("test.png");
      expect(imageEntryListMock.value[0].errors).toHaveLength(0);
    });

    test("should handle errors when adding a same file", async () => {
      const imageEntryListMock = ref<ImageEntry[]>([]);
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { addFileToImageEntryList } = useImageEntryList(
        imageEntryListMock,
        errorsMock,
      );
      const file = new File([""], "test.png", { type: "image/png" });
      const opts = {
        originalPixelSize: 1,
        scaleSizePercent: 100,
        scaleMode: ScaleMode.Smooth,
      };

      await addFileToImageEntryList(file, opts);
      expect(errorsMock.value).toHaveLength(0);

      await addFileToImageEntryList(file, opts);
      expect(errorsMock.value).toHaveLength(1);
      expect(errorsMock.value[0].code).toBe("error.file.duplicate-image");
    });

    test("should handle CustomError", async () => {
      const imageEntryListMock = ref<ImageEntry[]>([]);
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { addFileToImageEntryList } = useImageEntryList(
        imageEntryListMock,
        errorsMock,
      );
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

      await addFileToImageEntryList(file, opts);
      expect(errorsMock.value).toHaveLength(1);
      expect(errorsMock.value[0].code).toBe(
        "error.input.canvas-is-unsupported",
      );

      spyInit.mockRestore();
    });

    test("should handle unknown error", async () => {
      const imageEntryListMock = ref<ImageEntry[]>([]);
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { addFileToImageEntryList } = useImageEntryList(
        imageEntryListMock,
        errorsMock,
      );
      const file = new File([""], "test.png", { type: "image/png" });
      const opts = {
        originalPixelSize: 1,
        scaleSizePercent: 100,
        scaleMode: ScaleMode.Smooth,
      };

      const spyInit = vi
        .spyOn(PSImageData, "init")
        .mockRejectedValueOnce(new Error("this is an unknown error"));

      await addFileToImageEntryList(file, opts);
      expect(errorsMock.value).toHaveLength(1);
      expect(errorsMock.value[0].code).toBe("error.unknown.unknown");
      expect(errorsMock.value[0].params).toHaveProperty("message");

      spyInit.mockRestore();
    });
  });

  describe("clearErrorsOneEntry", () => {
    test("should clear errors for a specific entry", async () => {
      const imageEntryListMock = ref<ImageEntry[]>(
        await Promise.all([
          dummyImageEntry({
            errors: [
              new ScaleError("invalid-image-size", {
                filename: "test.png",
                originalPixelSize: -1,
              }),
            ],
          }),
          dummyImageEntry(),
        ]),
      );
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { clearErrorsOneEntry } = useImageEntryList(
        imageEntryListMock,
        errorsMock,
      );

      expect(imageEntryListMock.value[0].errors).toHaveLength(1);
      clearErrorsOneEntry(imageEntryListMock.value[0].image.uuid);
      expect(imageEntryListMock.value[0].errors).toHaveLength(0);
    });

    test("should not clear errors if entry not found", async () => {
      const imageEntryListMock = ref<ImageEntry[]>(
        await Promise.all([dummyImageEntry(), dummyImageEntry()]),
      );
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { clearErrorsOneEntry } = useImageEntryList(
        imageEntryListMock,
        errorsMock,
      );
      clearErrorsOneEntry("non-existent-uuid");

      expect(imageEntryListMock.value[0].errors).toHaveLength(0);
    });
  });

  describe("deleteOne", () => {
    test("should delete a specific entry", async () => {
      const imageEntryListMock = ref<ImageEntry[]>(
        await Promise.all([dummyImageEntry(), dummyImageEntry()]),
      );
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { deleteOne } = useImageEntryList(imageEntryListMock, errorsMock);

      expect(imageEntryListMock.value).toHaveLength(2);
      deleteOne(imageEntryListMock.value[0].image.uuid);
      expect(imageEntryListMock.value).toHaveLength(1);
    });

    test("should not delete if entry not found", async () => {
      const imageEntryListMock = ref<ImageEntry[]>(
        await Promise.all([dummyImageEntry(), dummyImageEntry()]),
      );
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { deleteOne } = useImageEntryList(imageEntryListMock, errorsMock);

      expect(imageEntryListMock.value).toHaveLength(2);
      deleteOne("non-existent-uuid");
      expect(imageEntryListMock.value).toHaveLength(2);
    });
  });

  describe("downloadOne", () => {
    test("should download a specific entry", async () => {
      const imageEntryListMock = ref<ImageEntry[]>(
        await Promise.all([dummyImageEntry(), dummyImageEntry()]),
      );
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { downloadOne } = useImageEntryList(imageEntryListMock, errorsMock);

      downloadStringMock.mockImplementation(() => Promise.resolve());

      downloadOne(imageEntryListMock.value[0].image.uuid);
      expect(downloadStringMock).toHaveBeenCalledWith(
        imageEntryListMock.value[0].image.url,
        imageEntryListMock.value[0].image.data.name,
        undefined,
      );

      downloadStringMock.mockRestore();
    });

    test("should not download if entry not found", async () => {
      const imageEntryListMock = ref<ImageEntry[]>(
        await Promise.all([dummyImageEntry(), dummyImageEntry()]),
      );
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { downloadOne } = useImageEntryList(imageEntryListMock, errorsMock);

      downloadStringMock.mockImplementation(() => Promise.resolve());

      downloadOne("non-existent-uuid");
      expect(downloadStringMock).not.toHaveBeenCalled();

      downloadStringMock.mockImplementation(() => Promise.resolve());
    });
  });

  describe("isImageEntryListEmpty", async () => {
    test.each<{
      description: string;
      imageEntryList: ImageEntry[];
      expected: boolean;
    }>([
      { description: "empty list", imageEntryList: [], expected: true },
      {
        description: "non-empty list",
        imageEntryList: [await dummyImageEntry()],
        expected: false,
      },
    ])("should return $description", ({ imageEntryList, expected }) => {
      const imageEntryListMock = ref<ImageEntry[]>(imageEntryList);
      const errorsMock = ref<CustomErrorObject[]>([]);

      const { isImageEntryListEmpty } = useImageEntryList(
        imageEntryListMock,
        errorsMock,
      );
      expect(isImageEntryListEmpty()).toBe(expected);
    });
  });
});
