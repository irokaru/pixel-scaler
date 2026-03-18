import { ScaleMode } from "@/constants/form";
import { nearestNeighbor, xBR } from "@/core/algorithm";
import { InputError } from "@/core/models/errors/InputError";
import type { GifFrame } from "@/core/types/gif";
import { readFileAsDataUrl } from "@/core/utils/fileUtils";
import { encodeAsGif } from "@/core/utils/gif";
import type {
  AnimatedGifPSImageDataObject,
  ImageEntry,
  PSImageDataObject,
  PSImageDataSettingType,
} from "@/types/convert";
import type { ScaleModeType } from "@/types/form";

type ScaleMethod = (
  file: PSImageDataObject,
  scaleSizePercent: number,
) => Promise<PSImageDataObject>;

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

const convertAnimatedGif = async (
  image: AnimatedGifPSImageDataObject,
  settings: PSImageDataSettingType,
): Promise<AnimatedGifPSImageDataObject> => {
  const scaleMethod = getScaleMethod(settings.scaleMode);

  if (!image.frames || image.frames.length === 0) {
    throw new InputError("encoding-error", { filename: image.data.name });
  }

  const scaledFrames: GifFrame[] = [];
  for (const frame of image.frames) {
    const scaledEntry = await scaleMethod(
      { ...image, imageData: frame.imageData, animated: false as const },
      settings.scaleSizePercent,
    );
    if (!scaledEntry.imageData) {
      throw new InputError("encoding-error", { filename: image.data.name });
    }

    scaledFrames.push({
      imageData: scaledEntry.imageData,
      delay: frame.delay,
    });
  }

  const gifFile = encodeAsGif(scaledFrames, image.data.name);
  const url = await readFileAsDataUrl(gifFile);

  return {
    ...image,
    imageData: scaledFrames[0].imageData,
    frames: scaledFrames,
    width: scaledFrames[0].imageData.width,
    height: scaledFrames[0].imageData.height,
    url,
    status: "scaled",
  };
};

/**
 * Convert an image entry using the specified scale method
 */
export const convertImage = async (
  entry: ImageEntry,
): Promise<PSImageDataObject> => {
  const { image, settings } = entry;

  if (image.animated) {
    const result = await convertAnimatedGif(image, settings);
    return result;
  }

  const scaleMethod = getScaleMethod(settings.scaleMode);
  const result = await scaleMethod(image, settings.scaleSizePercent);

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
