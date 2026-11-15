import { encodeAsGif } from "@/core/utils/gif";

export const imageDataToFile = async (
  imageData: ImageData,
  filename: string,
  fileType: string,
): Promise<File> => {
  return fileType === "image/gif"
    ? encodeAsGif([{ imageData, delay: 100 }], filename)
    : encodeAsCanvasBlob(imageData, filename, fileType);
};

const encodeAsCanvasBlob = (
  imageData: ImageData,
  filename: string,
  fileType: string,
): Promise<File> => {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("could not get 2d context");
  }
  context.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("could not create blob"));
        return;
      }
      resolve(new File([blob], filename, { type: fileType }));
    }, fileType);
  });
};

export const resizeImageData = async (
  imageData: ImageData,
  width: number,
  height: number,
  isImageSmoothingEnabled = true,
): Promise<ImageData> => {
  const resizeWidth = Math.floor(width);
  const resizeHeight = Math.floor(height);

  const imageBitmap = await createImageBitmap(imageData);
  const canvas = document.createElement("canvas");
  canvas.width = resizeWidth;
  canvas.height = resizeHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("could not get 2d context");
  }
  context.imageSmoothingEnabled = isImageSmoothingEnabled;

  context.scale(resizeWidth / imageData.width, resizeHeight / imageData.height);
  context.drawImage(imageBitmap, 0, 0);

  return context.getImageData(0, 0, resizeWidth, resizeHeight);
};

export const revokeObjectURL = (url: string) => {
  URL.revokeObjectURL(url);
};
