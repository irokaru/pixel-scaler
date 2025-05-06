export const imageDataToFile = (
  imageData: ImageData,
  filename: string,
  fileType: string,
): Promise<File> => {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("could not get 2d context");
  }
  ctx.putImageData(imageData, 0, 0);

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
  imageSmoothingEnabled = true,
): Promise<ImageData> => {
  const resizeWidth = Math.floor(width);
  const resizeHeight = Math.floor(height);

  const imageBitmap = await createImageBitmap(imageData);
  const canvas = document.createElement("canvas");
  canvas.width = resizeWidth;
  canvas.height = resizeHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("could not get 2d context");
  }
  ctx.imageSmoothingEnabled = imageSmoothingEnabled;

  ctx.scale(resizeWidth / imageData.width, resizeHeight / imageData.height);
  ctx.drawImage(imageBitmap, 0, 0);

  return ctx.getImageData(0, 0, resizeWidth, resizeHeight);
};

export const revokeObjectURL = (url: string) => {
  URL.revokeObjectURL(url);
};
