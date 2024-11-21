import { ref } from "vue";

import { ConvertedFile, ConvertError } from "@/@types/convert";
import { nearestNeighbor, xbr } from "@/algorithm";
import { InputImageData } from "@/models/InputImageData";
import {
  ScaleModeNearestKey,
  ScaleModeSmoothKey,
  ScaleModeType,
} from "@/static/form";

const scaleMethods: Record<
  ScaleModeType,
  (
    file: InputImageData,
    width: number,
    height: number,
  ) => Promise<InputImageData>
> = {
  [ScaleModeSmoothKey]: xbr,
  [ScaleModeNearestKey]: nearestNeighbor,
};

const useImageConvert = () => {
  const files = ref<InputImageData[]>([]);
  const scaledFiles = ref<ConvertedFile[]>([]);

  const convert = async (
    scaleMode: ScaleModeType,
    scaleSizePercent: number,
  ): Promise<{ results: ConvertedFile[]; errors: ConvertError[] }> => {
    const results: ConvertedFile[] = [];
    const errors: ConvertError[] = [];

    for (const file of files.value) {
      const scaledWidth = Math.round((file.width * scaleSizePercent) / 100);
      const scaledHeight = Math.round((file.height * scaleSizePercent) / 100);

      try {
        const scaledFile = await scaleMethods[scaleMode](
          file as InputImageData,
          scaledWidth,
          scaledHeight,
        );
        results.push({
          file: scaledFile,
          scaledSizePercent: scaleSizePercent,
          scaledType: scaleMode,
        });
      } catch (error) {
        errors.push({
          filename: file.data.name,
          message:
            error instanceof Error ? error.message : JSON.stringify(error),
        });
      }
    }

    return { results, errors };
  };

  return { files, scaledFiles, convert };
};

export default useImageConvert;
