import { PSImageData } from "@/core/models/InputImageData";
import { resizeImageData } from "@/core/utils/imageUtils";
import { PSImageDataObject } from "@/types/convert";

/**
 * Scales an image using the nearest neighbor algorithm.
 *
 * @param inputImageData - The input image data object containing the image and its metadata.
 * @param scaleSizePercent - The scaling percentage to resize the image. For example, 50 for 50% or 200 for 200%.
 * @returns A promise that resolves to a `PSImageData` object containing the resized image data.
 *
 * @remarks
 * This function calculates the new dimensions of the image based on the provided scaling percentage,
 * resizes the image using the nearest neighbor algorithm, and converts the resized image data into
 * a file format compatible with the `PSImageData` class.
 *
 * @throws Will throw an error if the resizing or file conversion fails.
 */
export const nearestNeighbor = async (
  inputImageData: PSImageDataObject,
  scaleSizePercent: number,
): Promise<PSImageData> => {
  const scaledWidth = Math.round(
    (inputImageData.width * scaleSizePercent) / 100,
  );
  const scaledHeight = Math.round(
    (inputImageData.height * scaleSizePercent) / 100,
  );

  const resizedImageData = await resizeImageData(
    // inputImageStore entries always have imageData set; null only occurs on scaled entries
    inputImageData.imageData!,
    scaledWidth,
    scaledHeight,
    false,
  );
  return PSImageData.fromImageData(resizedImageData, inputImageData);
};
