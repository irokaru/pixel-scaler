import { v4 as uuidv4 } from "uuid";

import { readFileAsDataUrl } from "@/core/utils/fileUtils";
import { decodeGifFrames, encodeAsGif, isAnimatedGif } from "@/core/utils/gif";
import type {
  AnimatedGifPSImageDataObject,
  PSImageDataObject,
  StaticPSImageDataObject,
} from "@/types/convert";

import { InputError } from "./errors/InputError";

const loadImageDataFromFile = async (file: File): Promise<ImageData> => {
  const img = new Image();
  const blobUrl = URL.createObjectURL(file);
  img.src = blobUrl;

  try {
    await img.decode();
  } catch {
    URL.revokeObjectURL(blobUrl);
    throw new InputError("encoding-error", { filename: file.name });
  }

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    URL.revokeObjectURL(blobUrl);
    throw new InputError("canvas-is-unsupported", { filename: file.name });
  }

  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(blobUrl);
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

export const createPSImageData = async (
  file: File,
): Promise<PSImageDataObject> => {
  if (!file.type.startsWith("image/")) {
    throw new InputError("invalid-image-type", { filename: file.name });
  }

  if (file.type === "image/gif" && (await isAnimatedGif(file))) {
    return createAnimatedGifPSImageData(file);
  }

  const imageData = await loadImageDataFromFile(file);

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
    animated: false,
  };
};

const createAnimatedGifPSImageData = async (
  file: File,
): Promise<AnimatedGifPSImageDataObject> => {
  const { frames, width, height } = await decodeGifFrames(file);

  if (frames.length === 0 || width <= 0 || height <= 0) {
    throw new InputError("invalid-image-size", { filename: file.name });
  }

  const url = await readFileAsDataUrl(file);

  return {
    uuid: uuidv4(),
    data: file,
    imageData: frames[0].imageData,
    frames,
    width,
    height,
    originalPixelSize: 0,
    url,
    status: "loaded",
    animated: true,
  };
};

export const createPSImageDataFromImageData = async (
  imageData: ImageData,
  source: PSImageDataObject,
): Promise<StaticPSImageDataObject> => {
  let url: string;

  if (source.data.type === "image/gif") {
    const gifFile = encodeAsGif([{ imageData, delay: 100 }], source.data.name);
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
    animated: false,
  };
};
