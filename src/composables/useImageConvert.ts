import { ref } from "vue";

import {
  ConvertedFile,
  ConvertError,
  ImageEntry,
  InputImageDataObject,
  InputImageDataSettingType,
  ScaleModeType,
} from "@/@types/convert";
import { nearestNeighbor, xbr } from "@/algorithm";
import { ScaleModeNearestKey, ScaleModeSmoothKey } from "@/constants/form";
import { vueI18n } from "@/core/config/i18n";
import { ScaleError } from "@/models/errors/ScaleError";
import { InputImageData, InputImageDataSetting } from "@/models/InputImageData";

const scaleMethods: Record<
  ScaleModeType,
  (
    file: InputImageDataObject,
    scaleSizePercent: number,
  ) => Promise<InputImageData>
> = {
  [ScaleModeSmoothKey]: xbr,
  [ScaleModeNearestKey]: nearestNeighbor,
};

const useImageConvert = () => {
  const imageEntryList = ref<ImageEntry[]>([]);
  const scaledFiles = ref<ConvertedFile[]>([]);
  const convertErrors = ref<ConvertError[]>([]);

  const pushFileToInputImageData = async (
    file: File,
    opts: { originalPixelSize: number } & InputImageDataSettingType,
  ) => {
    const inputImageData = await InputImageData.init(file);
    inputImageData.originalPixelSize = opts.originalPixelSize;
    const settings = new InputImageDataSetting(opts);
    imageEntryList.value.push({ image: inputImageData.toObject(), settings });
  };

  const convert = async (
    scaleMode: ScaleModeType,
    scaleSizePercent: number,
    shouldStore = true,
  ): Promise<{ results: ConvertedFile[]; errors: ConvertError[] }> => {
    const results: ConvertedFile[] = [];
    const errors: ConvertError[] = [];

    for (const index of imageEntryList.value.keys()) {
      const result = await convertOne(
        index,
        scaleMode,
        scaleSizePercent,
        shouldStore,
      );
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
    scaleMode: ScaleModeType,
    scaleSizePercent: number,
    shouldStore = true,
  ): Promise<ConvertedFile | ConvertError> => {
    const entry = imageEntryList.value[entryIndex].image;
    try {
      const scaledFile = await scaleMethods[scaleMode](entry, scaleSizePercent);
      const result = {
        file: scaledFile.toObject(),
        scaledSizePercent: scaleSizePercent,
        scaledType: scaleMode,
      };
      if (shouldStore) {
        scaledFiles.value.push(result);
      }
      return result;
    } catch (error) {
      const convertError = createConvertError(entry, error);
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

  const deleteOneImageEntry = (index: number) => {
    imageEntryList.value.splice(index, 1);
  };

  return {
    imageEntryList,
    scaledFiles,
    convertErrors,
    pushFileToInputImageData,
    convert,
    convertOne,
    createConvertError,
    deleteOneImageEntry,
  };
};

export default useImageConvert;
