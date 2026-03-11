import { GIFEncoder, quantize, applyPalette } from "gifenc";

export const imageDataToFile = async (
  imageData: ImageData,
  filename: string,
  fileType: string,
): Promise<File> => {
  if (fileType === "image/gif") {
    return encodeAsGif(imageData, filename);
  }
  return encodeAsCanvasBlob(imageData, filename, fileType);
};

// NOTE: For animated GIFs, only the first frame is processed
// TODO: Add support for animated GIFs
const encodeAsGif = (imageData: ImageData, filename: string): File => {
  const { width, height, data } = imageData;

  const palette = quantize(data, 256, { format: "rgba4444" });
  const index = applyPalette(data, palette);
  const transparent = Array.from(
    { length: data.length / 4 },
    (_, i) => data[i * 4 + 3],
  ).some((a) => a < 255);

  const encoder = GIFEncoder();
  encoder.writeFrame(index, width, height, { palette, transparent });
  encoder.finish();
  // NOTE: gifenc's TypeScript types are inaccurate and cause the bytes property to be typed as Uint8Array<number>, which is not compatible with the File constructor. We need to assert it as Uint8Array<ArrayBuffer> to satisfy the type checker.
  return new File([encoder.bytes() as Uint8Array<ArrayBuffer>], filename, {
    type: "image/gif",
  });
};

const encodeAsCanvasBlob = (
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
