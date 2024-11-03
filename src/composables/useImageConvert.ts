import { ref } from "vue";

import { nearestNeighbor, xbr } from "@/algorithm";
import {
  ScaleModeNearestKey,
  ScaleModeSmoothKey,
  ScaleModeType,
} from "@/static/form";
import { getImageDimensions } from "@/utils/imageUtils";

const scaleMethods: Record<
  ScaleModeType,
  (file: File, width: number, height: number) => Promise<File>
> = {
  [ScaleModeSmoothKey]: xbr,
  [ScaleModeNearestKey]: nearestNeighbor,
};

const useImageConvert = () => {
  const files = ref<File[]>([]);
  const scaledFiles = ref<ConvertedFile[]>([]);

  const convert = async (
    scaleMode: ScaleModeType,
    scaleSizePercent: number,
  ): Promise<{ results: ConvertedFile[]; errors: ConvertError[] }> => {
    const results: ConvertedFile[] = [];
    const errors: ConvertError[] = [];

    for (const file of files.value) {
      const { width, height } = await getImageDimensions(file);

      const scaledWidth = Math.round((width * scaleSizePercent) / 100);
      const scaledHeight = Math.round((height * scaleSizePercent) / 100);

      try {
        const scaledFile = await scaleMethods[scaleMode](
          file,
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
          filename: file.name,
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
