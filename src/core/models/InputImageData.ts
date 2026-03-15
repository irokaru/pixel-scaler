import { v4 as uuidv4 } from "uuid";

import { encodeAsGif } from "@/core/utils/gif";
import { PSImageDataObject } from "@/types/convert";

import { InputError } from "./errors/InputError";

const loadImageDataFromFile = async (file: File): Promise<ImageData> => {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  try {
    await img.decode();
  } catch {
    throw new InputError("encoding-error", { filename: file.name });
  }

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new InputError("canvas-is-unsupported", { filename: file.name });
  }

  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
};

const imageDataToDataUrl = (
  imageData: ImageData,
  mimeType: string,
  filename: string,
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new InputError("canvas-is-unsupported", { filename });
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL(mimeType);
};

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
};

export const createPSImageData = async (
  file: File,
): Promise<PSImageDataObject> => {
  const imageData = await loadImageDataFromFile(file);

  if (!file.type.startsWith("image/")) {
    throw new InputError("invalid-image-type", { filename: file.name });
  }

  if (imageData.width <= 0 || imageData.height <= 0) {
    throw new InputError("invalid-image-size", { filename: file.name });
  }

  const url =
    file.type === "image/gif"
      ? await readFileAsDataUrl(file)
      : imageDataToDataUrl(imageData, file.type, file.name);

  return {
    uuid: uuidv4(),
    data: file,
    imageData,
    width: imageData.width,
    height: imageData.height,
    originalPixelSize: 0,
    url,
    status: "loaded",
  };
};

export const createPSImageDataFromImageData = async (
  imageData: ImageData,
  source: PSImageDataObject,
): Promise<PSImageDataObject> => {
  let url: string;

  if (source.data.type === "image/gif") {
    const gifFile = encodeAsGif(imageData, source.data.name);
    url = await readFileAsDataUrl(gifFile);
  } else {
    url = imageDataToDataUrl(imageData, source.data.type, source.data.name);
  }

  return {
    uuid: uuidv4(),
    data: source.data,
    imageData,
    width: imageData.width,
    height: imageData.height,
    originalPixelSize: source.originalPixelSize,
    url,
    status: "loaded",
  };
};
