import { InputImageData } from "@/models/InputImageData";
import { imageDataToFile, resizeImageData } from "@/utils/imageUtils";

/**
 * Resizes an image using the nearest neighbor algorithm.
 * @param inputImageData - The input image blob.
 * @param width - The desired width of the output image.
 * @param height - The desired height of the output image.
 * @returns A Promise that resolves to the resized image blob.
 */
export const nearestNeighbor = async (
  inputImageData: InputImageData,
  width: number,
  height: number,
): Promise<InputImageData> => {
  const resizedImageData = await resizeImageData(
    inputImageData.imageData,
    width,
    height,
    false,
  );
  const resizedFile = await imageDataToFile(
    resizedImageData,
    inputImageData.data.name,
    inputImageData.data.type,
  );
  return InputImageData.init(resizedFile);
};
