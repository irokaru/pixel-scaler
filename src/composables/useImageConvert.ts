import { Ref, ref } from "vue";

import {
  ConvertedFile,
  ConvertError,
  ImageEntry,
  InputImageDataObject,
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

const useImageConvert = (imageEntryList: Ref<ImageEntry[]>) => {
  const scaledFiles = ref<ConvertedFile[]>([]);
  const convertErrors = ref<ConvertError[]>([]);

  const convertAll = async (
    shouldStore = true,
  ): Promise<{ results: ConvertedFile[]; errors: ConvertError[] }> => {
    const results: ConvertedFile[] = [];
    const errors: ConvertError[] = [];

    // NOTE: every is used to check if all entries are unchecked
    const isEvery = imageEntryList.value.every(
      (entry) => !entry.settings.checked,
    );

    const filteredImageEntryList = imageEntryList.value.filter(
      (entry) => isEvery || entry.settings.checked,
    );

    for (const index of filteredImageEntryList.keys()) {
      const result = await convertOne(index, shouldStore);
      if ("file" in result) {
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
  ): Promise<ConvertedFile | ConvertError> => {
    const { image, settings } = imageEntryList.value[entryIndex];
    try {
      const scaledFile = await scaleMethods[settings.scaleMode](
        image,
        settings.scaleSizePercent,
      );
      const result = {
        file: scaledFile.toObject(),
        scaledSizePercent: settings.scaleSizePercent,
        scaledType: settings.scaleMode,
      };
      if (shouldStore) {
        scaledFiles.value.push(result);
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
    scaledFiles,
    convertErrors,
    convertAll,
    convertOne,
    createConvertError,
  };
};

export default useImageConvert;
