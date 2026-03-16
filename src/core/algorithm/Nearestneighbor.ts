import { createPSImageDataFromImageData } from "@/core/models/InputImageData";
import { resizeImageData } from "@/core/utils/imageUtils";
import type { PSImageDataObject } from "@/types/convert";

/**
 * Scales an image using the nearest neighbor algorithm.
 *
 * @param inputImageData - The input image data object containing the image and its metadata.
 * @param scaleSizePercent - The scaling percentage to resize the image. For example, 50 for 50% or 200 for 200%.
 * @returns A promise that resolves to a `PSImageDataObject` containing the resized image data.
 *
 * @throws Will throw an error if the resizing or file conversion fails.
 */
export const nearestNeighbor = async (
  inputImageData: PSImageDataObject,
  scaleSizePercent: number,
): Promise<PSImageDataObject> => {
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
  return createPSImageDataFromImageData(resizedImageData, inputImageData);
};
