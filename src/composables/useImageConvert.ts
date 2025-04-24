import { Ref, ref } from "vue";

import {
  ConvertError,
  ImageEntry,
  PSImageDataObject,
  ImageCheckList,
} from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";
import { nearestNeighbor, xBR } from "@/algorithm";
import { ScaleMode } from "@/constants/form";
import { vueI18n } from "@/core/plugins/i18n";
import { ScaleError } from "@/models/errors/ScaleError";
import { PSImageData } from "@/models/InputImageData";

import useImageItemOperation from "./useImageItemOperation";

type ScaleMethod = (
  file: PSImageDataObject,
  scaleSizePercent: number,
) => Promise<PSImageData>;

const scaleMethods: Record<ScaleModeType, ScaleMethod> = {
  [ScaleMode.Smooth]: xBR,
  [ScaleMode.Nearest]: nearestNeighbor,
};

const useImageConvert = (
  imageEntryList: Ref<ImageEntry[]>,
  scaledImageList: Ref<ImageEntry[]>,
) => {
  const { getCheckedItems } = useImageItemOperation(imageEntryList);
  const convertErrors = ref<ConvertError[]>([]);

  const convertAnyChecked = async (
    checkedMap: ImageCheckList,
    shouldStore = true,
  ): Promise<{ results: ImageEntry[]; errors: ConvertError[] }> => {
    const results: ImageEntry[] = [];
    const errors: ConvertError[] = [];

    const targets = getCheckedItems(checkedMap);

    for (const entry of targets) {
      const result = await convertOne(entry, shouldStore);
      if ("image" in result) {
        results.push(result);
      } else {
        errors.push(result);
      }
    }

    return { results, errors };
  };

  const convertOneByIndex = async (
    entryIndex: number,
    shouldStore = true,
  ): Promise<ImageEntry | ConvertError> => {
    const entry = imageEntryList.value[entryIndex];
    return await convertOne(entry, shouldStore);
  };

  const convertOne = async (
    entry: ImageEntry,
    shouldStore = true,
  ): Promise<ImageEntry | ConvertError> => {
    const { image, settings } = entry;

    try {
      if (isDuplicate(entry)) {
        throw new ScaleError("duplicate-image-and-settings", {
          scaleSizePercent: settings.scaleSizePercent,
          scaleMode: settings.scaleMode,
        });
      }

      const scaledFile = await scaleMethods[settings.scaleMode](
        image,
        settings.scaleSizePercent,
      );

      const result: ImageEntry = {
        image: scaledFile.toObject(),
        settings,
      };
      result.image.status = "scaled";

      if (shouldStore) {
        scaledImageList.value.push(result);
      }

      return result;
    } catch (error) {
      const convertError = createConvertError(image, error);
      if (shouldStore) {
        convertErrors.value.push(convertError);
      }
      return convertError;
    }
  };

  const isDuplicate = (entry: ImageEntry): boolean => {
    return scaledImageList.value.some(
      (scaledImage) =>
        scaledImage.image.data.name === entry.image.data.name &&
        scaledImage.settings.scaleSizePercent ===
          entry.settings.scaleSizePercent &&
        scaledImage.image.originalPixelSize === entry.image.originalPixelSize &&
        scaledImage.settings.scaleMode === entry.settings.scaleMode,
    );
  };

  const createConvertError = (
    entry: PSImageDataObject,
    error: unknown,
  ): ConvertError => {
    return {
      filename: entry.data.name,
      message: getErrorMessage(error),
    };
  };

  const getErrorMessage = (error: unknown): string => {
    if (!(error instanceof Error)) {
      return vueI18n.global.t("error.unknown", {
        message: JSON.stringify(error),
      });
    }

    if (error instanceof ScaleError) {
      return vueI18n.global.t(`error.${error.code}`, error.params);
    }

    return vueI18n.global.t("error.unknown", { message: error.message });
  };

  return {
    convertErrors,
    convertAnyChecked,
    convertOneByIndex,
    convertOne,
    createConvertError,
  };
};

export default useImageConvert;
