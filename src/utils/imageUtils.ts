import { FAILED_TO_READ_FILE } from "@/static/errors";

export const getImageDimensions = (
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
