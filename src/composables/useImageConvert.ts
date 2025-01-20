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
  ): Promise<{ results: ConvertedFile[]; errors: ConvertError[] }> => {
    const results: ConvertedFile[] = [];
    const errors: ConvertError[] = [];

    for (const entry of imageEntryList.value.values()) {
      try {
        const scaledFile = await scaleMethods[scaleMode](
          entry.image as InputImageDataObject,
          scaleSizePercent,
        );
        results.push({
          file: scaledFile,
          scaledSizePercent: scaleSizePercent,
          scaledType: scaleMode,
        });
      } catch (error) {
        console.trace(error);
        errors.push({
          filename: entry.image.data.name,
          message:
            error instanceof Error ? error.message : JSON.stringify(error),
        });
      }
    }

    return { results, errors };
  };

  return { imageEntryList, scaledFiles, pushFileToInputImageData, convert };
};

export default useImageConvert;
