import { ref } from "vue";

import { nearestNeighbor } from "@/algorithm/Nearestneighbor";
import { FAILED_TO_READ_FILE } from "@/static/errors";
import { ScaleMode, ScaleModeType } from "@/static/form";

const scaleMethods: Record<
  ScaleModeType,
  (file: File, width: number, height: number) => Promise<File>
> = {
  [ScaleMode[0]]: nearestNeighbor,
  [ScaleMode[1]]: nearestNeighbor,
};

const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.addEventListener("load", (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.addEventListener("load", () =>
        resolve({ width: img.width, height: img.height }),
      );
    });
    fr.addEventListener("error", () => reject(new Error(FAILED_TO_READ_FILE)));
    fr.readAsDataURL(file);
  });
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
