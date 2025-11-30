import { ImageEntry, PSImageDataSettingType } from "@/@types/convert";
import { PSImageData, PSImageDataSetting } from "@/models/InputImageData";

/**
 * Create an ImageEntry from a File with specified settings
 */
export const createImageEntry = async (
  file: File,
  opts: { originalPixelSize: number } & PSImageDataSettingType,
): Promise<ImageEntry> => {
  const inputImageData = await PSImageData.init(file);
  inputImageData.originalPixelSize = opts.originalPixelSize;

  const settings = new PSImageDataSetting(opts);

  return {
    image: inputImageData.toObject(),
    settings,
    errors: [],
  };
};

/**
 * Check if a URL already exists in the entry list
 */
export const isDuplicateUrl = (
  url: string,
  existingEntries: ImageEntry[],
): boolean => {
  return existingEntries.some((entry) => entry.image.url === url);
};

/**
 * Find an entry by UUID
 */
export const findEntryByUuid = (
  uuid: string,
  entries: ImageEntry[],
): ImageEntry | undefined => {
  return entries.find((entry) => entry.image.uuid === uuid);
};
