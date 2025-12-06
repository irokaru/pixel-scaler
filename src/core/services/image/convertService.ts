import { ImageEntry, PSImageDataObject } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";
import { nearestNeighbor, xBR } from "@/algorithm";
import { ScaleMode } from "@/constants/form";
import { PSImageData } from "@/models/InputImageData";

type ScaleMethod = (
  file: PSImageDataObject,
  scaleSizePercent: number,
) => Promise<PSImageData>;

/**
 * Get the scale method based on the scale mode
 */
export const getScaleMethod = (mode: ScaleModeType): ScaleMethod => {
  const scaleMethods: Record<ScaleModeType, ScaleMethod> = {
    [ScaleMode.Smooth]: xBR,
    [ScaleMode.Nearest]: nearestNeighbor,
  };
  return scaleMethods[mode];
};

/**
 * Convert an image entry using the specified scale method
 */
export const convertImage = async (
  entry: ImageEntry,
): Promise<PSImageDataObject> => {
  const { image, settings } = entry;
  const scaleMethod = getScaleMethod(settings.scaleMode);
  const scaledFile = await scaleMethod(image, settings.scaleSizePercent);

  const result = scaledFile.toObject();
  result.status = "scaled";

  return result;
};

/**
 * Check if an image entry is a duplicate based on name, settings, and pixel size
 */
export const isDuplicateEntry = (
  entry: ImageEntry,
  existingList: ImageEntry[],
): boolean => {
  return existingList.some(
    (scaledImage) =>
      scaledImage.image.data.name === entry.image.data.name &&
      scaledImage.settings.scaleSizePercent ===
        entry.settings.scaleSizePercent &&
      scaledImage.image.originalPixelSize === entry.image.originalPixelSize &&
      scaledImage.settings.scaleMode === entry.settings.scaleMode,
  );
};
