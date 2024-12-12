import { ref } from "vue";

import { ConvertedFile, ConvertError } from "@/@types/convert";
import { nearestNeighbor, xbr } from "@/algorithm";
import {
  ScaleModeNearestKey,
  ScaleModeSmoothKey,
  ScaleModeType,
} from "@/constants/form";
import { InputImageData } from "@/models/InputImageData";

const scaleMethods: Record<
  ScaleModeType,
  (file: InputImageData, scaleSizePercent: number) => Promise<InputImageData>
> = {
  [ScaleModeSmoothKey]: xbr,
  [ScaleModeNearestKey]: nearestNeighbor,
};

const useImageConvert = () => {
  const inputImageDataList = ref<InputImageData[]>([]);
  const scaledFiles = ref<ConvertedFile[]>([]);

  const pushFileToInputImageData = async (
    file: File,
    opts: { originalPixelSize: number },
  ) => {
    const inputImageData = await InputImageData.init(file);
    inputImageData.originalPixelSize = opts.originalPixelSize;
    inputImageDataList.value.push(inputImageData);
  };

  const convert = async (
    scaleMode: ScaleModeType,
    scaleSizePercent: number,
  ): Promise<{ results: ConvertedFile[]; errors: ConvertError[] }> => {
    const results: ConvertedFile[] = [];
    const errors: ConvertError[] = [];

    for (const inputImageData of inputImageDataList.value as InputImageData[]) {
      try {
        const scaledFile = await scaleMethods[scaleMode](
          inputImageData,
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
          filename: inputImageData.data.name,
          message:
            error instanceof Error ? error.message : JSON.stringify(error),
        });
      }
    }

    return { results, errors };
  };

  return { inputImageDataList, scaledFiles, pushFileToInputImageData, convert };
};

export default useImageConvert;
