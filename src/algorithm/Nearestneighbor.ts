import { FAILED_TO_CREATE_BLOB, FAILED_TO_READ_FILE } from "@/static/errors";

/**
 * Resizes an image using the nearest neighbor algorithm.
 * @param file - The input image blob.
 * @param width - The desired width of the output image.
 * @param height - The desired height of the output image.
 * @returns A Promise that resolves to the resized image blob.
 */
export const nearestNeighbor = (
  file: File,
  width: number,
  height: number,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();

    fr.addEventListener("load", async (e) => {
      const img = new Image();
      img.src = e.target?.result as string;

      img.addEventListener("load", () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) {
            const f = new File([blob], file.name, { type: file.type });
            resolve(f);
          } else {
            reject(new Error(FAILED_TO_CREATE_BLOB));
          }
        });
      });
    });
    fr.addEventListener("error", () => reject(new Error(FAILED_TO_READ_FILE)));
    fr.readAsDataURL(file);
  });
};
