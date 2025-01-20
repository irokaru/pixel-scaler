import { InputImageDataObject } from "@/@types/convert";
import { InputImageData } from "@/models/InputImageData";
import { imageDataToFile, resizeImageData } from "@/utils/imageUtils";

/**
 * Scales an image using the nearest neighbor algorithm.
 *
 * @param inputImageData - The input image data to be scaled.
 * @param scaleSizePercent - The percentage to scale the image by.
 * @returns A promise that resolves to the scaled image data.
 */
export const nearestNeighbor = async (
  inputImageData: InputImageDataObject,
  scaleSizePercent: number,
): Promise<InputImageData> => {
  const scaledWidth = Math.round(
    (inputImageData.width * scaleSizePercent) / 100,
  );
  const scaledHeight = Math.round(
    (inputImageData.height * scaleSizePercent) / 100,
  );

  const resizedImageData = await resizeImageData(
    inputImageData.imageData,
    scaledWidth,
    scaledHeight,
    false,
  );
  const resizedFile = await imageDataToFile(
    resizedImageData,
    inputImageData.data.name,
    inputImageData.data.type,
  );
  return InputImageData.init(resizedFile);
};
