import { v4 as uuidv4 } from "uuid";

import type { PSImageDataObject } from "@/types/convert";

export const createPSImageData = async (
  file: File,
): Promise<PSImageDataObject> => {
  return {
    uuid: uuidv4(),
    data: file,
    imageData: new ImageData(1, 1),
    width: 1,
    height: 1,
    originalPixelSize: 0,
    url: `data:image/png;base64,mock-image-url-${file.name}`,
    status: "loaded",
  };
};

export const createPSImageDataFromImageData = async (
  imageData: ImageData,
  source: PSImageDataObject,
): Promise<PSImageDataObject> => {
  return {
    uuid: uuidv4(),
    data: source.data,
    imageData,
    width: imageData.width,
    height: imageData.height,
    originalPixelSize: source.originalPixelSize,
    url: `data:image/png;base64,mock-image-url-${source.data.name}`,
    status: "loaded",
  };
};
