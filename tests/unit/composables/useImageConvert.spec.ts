import { ref } from "vue";

vi.mock("@/models/InputImageData");

import { ImageEntry, ImageCheckList } from "@/@types/convert";
import { CustomErrorObject } from "@/@types/error";
import { ScaleModeType } from "@/@types/form";
import * as algorithm from "@/algorithm";
import useImageConvert from "@/composables/useImageConvert";
import { ScaleMode } from "@/constants/form";
import { ScaleError } from "@/models/errors/ScaleError";
import { PSImageData } from "@/models/InputImageData";

import { dummyImageEntry } from "../__mocks__/models/InputImageData";

describe("useImageConvert", async () => {
  const imageList = ref<ImageEntry[]>([]);
  const scaledList = ref<ImageEntry[]>([]);
  const errors = ref<CustomErrorObject[]>([]);
  let convert: ReturnType<typeof useImageConvert>;

  beforeEach(() => {
    vi.clearAllMocks();
    imageList.value = [];
    scaledList.value = [];
    errors.value = [];
    convert = useImageConvert(imageList, scaledList, errors);
  });

  describe("convertAnyChecked", async () => {
    test.each<{ mode: ScaleModeType; method: "xBR" | "nearestNeighbor" }>([
      { mode: ScaleMode.Smooth, method: "xBR" },
      { mode: ScaleMode.Nearest, method: "nearestNeighbor" },
    ])("calls correct method for mode: $mode", async ({ mode, method }) => {
      const methodMock = vi
        .spyOn(algorithm, method as "xBR" | "nearestNeighbor")
        .mockResolvedValue(
          await PSImageData.init(new File([], `scaled-${method}.png`)),
        );

      const entry = await dummyImageEntry({
        image: { uuid: `test-${mode}` },
        settings: { scaleSizePercent: 200, scaleMode: mode },
      });
      imageList.value.push(entry);

      const checkedMap: ImageCheckList = { [entry.image.uuid]: true };
      await convert.convertAnyChecked(checkedMap);

      expect(methodMock.mock.calls).toHaveLength(1);
      expect(methodMock.mock.calls[0]).toEqual([entry.image, 200]);
      expect(scaledList.value.length).toBe(1);
      expect(scaledList.value[0].image.status).toBe("scaled");
    });

    test("does convert if all unchecked", async () => {
      const entry = await dummyImageEntry({ image: { uuid: "test-1" } });
      const entry2 = await dummyImageEntry({ image: { uuid: "test-2" } });
      imageList.value.push(entry, entry2);

      const checkedMap: ImageCheckList = {
        [entry.image.uuid]: false,
        [entry2.image.uuid]: false,
      };
      await convert.convertAnyChecked(checkedMap);

      expect(scaledList.value.length).toBe(2);
      expect(scaledList.value[0].image.status).toBe("scaled");
    });

    test("does convert if unchecked", async () => {
      const entry = await dummyImageEntry({ image: { uuid: "test-1" } });
      const entry2 = await dummyImageEntry({ image: { uuid: "test-2" } });
      imageList.value = [entry, entry2];

      const checkedMap: ImageCheckList = {
        [entry.image.uuid]: false,
        [entry2.image.uuid]: true,
      };
      await convert.convertAnyChecked(checkedMap);

      expect(scaledList.value.length).toBe(1);
      expect(scaledList.value[0].image.status).toBe("scaled");
    });

    test("handles duplicate detection", async () => {
      const entry = await dummyImageEntry({
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });
      imageList.value.push(entry);

      scaledList.value.push({
        image: entry.image,
        settings: entry.settings,
        errors: [],
      });

      const checkedMap: ImageCheckList = { [entry.image.uuid]: true };
      await convert.convertAnyChecked(checkedMap);

      expect(scaledList.value.length).toBe(1);
      expect(entry.errors.length).toBe(1);
      expect(entry.errors[0].kind).toBe("scale");
    });

    test("handles unknown errors", async () => {
      const entry = await dummyImageEntry({
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });
      imageList.value.push(entry);

      vi.spyOn(algorithm, "xBR").mockRejectedValueOnce(
        new Error("unexpected failure"),
      );

      const checkedMap: ImageCheckList = { [entry.image.uuid]: true };
      await convert.convertAnyChecked(checkedMap);

      expect(errors.value.length).toBe(1);
      expect(errors.value[0].kind).toBe("unknown");
    });
  });

  describe("convertOneByUuid", async () => {
    test("calls convertOne with correct uuid", async () => {
      const scaleMethodMock = vi
        .spyOn(algorithm, "xBR")
        .mockResolvedValue(await PSImageData.init(new File([], "scaled.png")));

      const entry = await dummyImageEntry({ image: { uuid: "test-uuid" } });
      imageList.value.push(entry);

      await convert.convertOneByUuid("test-uuid");

      expect(scaleMethodMock).toHaveBeenCalledTimes(1);
      expect(scaleMethodMock).toHaveBeenCalledWith(
        entry.image,
        entry.settings.scaleSizePercent,
      );
    });

    test("does not call convertOne if uuid not found", async () => {
      const entry = await dummyImageEntry({ image: { uuid: "test-uuid" } });
      imageList.value.push(entry);

      const convertOneMock = vi
        .spyOn(convert, "convertOne")
        .mockResolvedValue();

      await convert.convertOneByUuid("non-existent-uuid");

      expect(convertOneMock).not.toHaveBeenCalled();
    });
  });

  describe("convertOne", async () => {
    test("calls correct scale method", async () => {
      const scaleMethodMock = vi
        .spyOn(algorithm, "xBR")
        .mockResolvedValue(await PSImageData.init(new File([], "scaled.png")));

      const entry = await dummyImageEntry({
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });
      imageList.value.push(entry);

      await convert.convertOne(entry);

      expect(scaleMethodMock).toHaveBeenCalledTimes(1);
      expect(scaleMethodMock).toHaveBeenCalledWith(
        entry.image,
        entry.settings.scaleSizePercent,
      );
      expect(scaledList.value.length).toBe(1);
      expect(scaledList.value[0].image.status).toBe("scaled");
    });

    test("handles duplicate detection", async () => {
      const entry = await dummyImageEntry({
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });
      imageList.value.push(entry);

      scaledList.value.push({
        image: entry.image,
        settings: entry.settings,
        errors: [],
      });

      await convert.convertOne(entry);

      expect(scaledList.value.length).toBe(1);
      expect(entry.errors.length).toBe(1);
      expect(entry.errors[0].kind).toBe("scale");
    });

    test.each<ScaleError["code"]>([
      "invalid-image-size",
      "unsupported-scale-size",
      "duplicate-image-and-settings",
    ])("handles scale errors (%s)", async (code) => {
      const entry = await dummyImageEntry({
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });
      imageList.value.push(entry);

      vi.spyOn(algorithm, "xBR").mockRejectedValueOnce(
        new ScaleError(code, {
          filename: entry.image.data.name,
          scaleMode: entry.settings.scaleMode,
          scaleSizePercent: entry.settings.scaleSizePercent,
        }),
      );

      await convert.convertOne(entry);

      expect(errors.value.length).toBe(0);
      expect(entry.errors.length).toBe(1);
      expect(entry.errors[0].kind).toBe("scale");
      expect(entry.errors[0].code).toBe(`error.scale.${code}`);
    });

    test("handles unknown errors", async () => {
      const entry = await dummyImageEntry({
        settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Smooth },
      });
      imageList.value.push(entry);

      vi.spyOn(algorithm, "xBR").mockRejectedValueOnce(
        new Error("unexpected failure"),
      );

      await convert.convertOne(entry);

      expect(errors.value.length).toBe(1);
      expect(errors.value[0].kind).toBe("unknown");
    });
  });
});
