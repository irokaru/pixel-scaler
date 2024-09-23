import { ref } from "vue";

import { nearestNeighbor, xbr } from "@/algorithm";
import { ScaleMode, ScaleModeType } from "@/static/form";
import { getImageDimensions } from "@/utils/imageUtils";

const scaleMethods: Record<
  ScaleModeType,
  (file: File, width: number, height: number) => Promise<File>
> = {
  [ScaleMode[0]]: xbr,
  [ScaleMode[1]]: nearestNeighbor,
};

const useImageConvert = () => {
  const files = ref<File[]>([]);
  const scaledFiles = ref<File[]>([]);

  const convert = async (
    scaleMode: ScaleModeType,
    scaleSizePercent: number,
  ): Promise<{ results: File[]; errors: ConvertError[] }> => {
    const results: File[] = [];
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
        results.push(scaledFile);
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
