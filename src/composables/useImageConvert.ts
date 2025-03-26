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
import { vueI18n } from "@/core/plugins/i18n";
import { FileError } from "@/models/errors/FileError";
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

    if (
      imageEntryList.value
        .values()
        .some((entry) => entry.image.url === inputImageData.toUrl())
    ) {
      throw new FileError("duplicate-file", { filename: file.name });
    }

    inputImageData.originalPixelSize = opts.originalPixelSize;
    const settings = new InputImageDataSetting(opts);
    imageEntryList.value.push({ image: inputImageData.toObject(), settings });
  };

  const convertAll = async (
    shouldStore = true,
  ): Promise<{ results: ConvertedFile[]; errors: ConvertError[] }> => {
    const results: ConvertedFile[] = [];
    const errors: ConvertError[] = [];

    for (const index of imageEntryList.value.keys()) {
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

  const deleteOneImageEntry = (index: number) => {
    imageEntryList.value.splice(index, 1);
  };

  const isImageEntryListEmpty = () => {
    return imageEntryList.value.length === 0;
  };

  return {
    imageEntryList,
    scaledFiles,
    convertErrors,
    pushFileToInputImageData,
    convertAll,
    convertOne,
    createConvertError,
    deleteOneImageEntry,
    isImageEntryListEmpty,
  };
};

export default useImageConvert;
