import { Ref, ref } from "vue";

import {
  ScaledImage,
  ConvertError,
  ImageEntry,
  InputImageDataObject,
  ImageCheckList,
} from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";
import { nearestNeighbor, xBR } from "@/algorithm";
import { ScaleMode } from "@/constants/form";
import { vueI18n } from "@/core/plugins/i18n";
import { ScaleError } from "@/models/errors/ScaleError";
import { InputImageData } from "@/models/InputImageData";

type ScaleMethod = (
  file: InputImageDataObject,
  scaleSizePercent: number,
) => Promise<InputImageData>;

const scaleMethods: Record<ScaleModeType, ScaleMethod> = {
  [ScaleMode.Smooth]: xBR,
  [ScaleMode.Nearest]: nearestNeighbor,
};

const useImageConvert = (
  imageEntryList: Ref<ImageEntry[]>,
  scaledImageList: Ref<ScaledImage[]>,
) => {
  const convertErrors = ref<ConvertError[]>([]);

  const convertAll = async (
    checkedMap: ImageCheckList,
    shouldStore = true,
  ): Promise<{ results: ScaledImage[]; errors: ConvertError[] }> => {
    const results: ScaledImage[] = [];
    const errors: ConvertError[] = [];

    // NOTE: every is used to check if all entries are unchecked
    const isEvery = imageEntryList.value.every(
      (entry) => !checkedMap[entry.image.uuid],
    );

    const filteredImageEntryList = imageEntryList.value.filter(
      (entry) => isEvery || checkedMap[entry.image.uuid],
    );

    for (const index of filteredImageEntryList.keys()) {
      const result = await convertOne(index, shouldStore);
      if ("image" in result) {
        results.push(result);
      } else {
        errors.push(result);
      }
    }

    return { results, errors };
  };

  const convertOne = async (
    entryIndex: number,
    shouldStore = true,
  ): Promise<ScaledImage | ConvertError> => {
    const { image, settings } = imageEntryList.value[entryIndex];
    try {
      if (checkDuplicate(imageEntryList.value[entryIndex])) {
        throw new ScaleError("duplicate-image-and-settings", {
          scaleSizePercent: settings.scaleSizePercent,
          scaleMode: settings.scaleMode,
        });
      }

      const scaledFile = await scaleMethods[settings.scaleMode](
        image,
        settings.scaleSizePercent,
      );
      const result: ScaledImage = {
        image: scaledFile.toObject(),
        scaledSizePercent: settings.scaleSizePercent,
        scaledType: settings.scaleMode,
      };
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

  const checkDuplicate = (entry: ImageEntry) => {
    return scaledImageList.value.some(
      (scaledImage) =>
        scaledImage.image.data.name === entry.image.data.name &&
        scaledImage.scaledSizePercent === entry.settings.scaleSizePercent &&
        scaledImage.scaledType === entry.settings.scaleMode,
    );
  };

  const createConvertError = (
    entry: InputImageDataObject,
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
    scaledImages: scaledImageList,
    convertErrors,
    convertAll,
    convertOne,
    createConvertError,
  };
};

export default useImageConvert;
