import { createPSImageData } from "@/core/models/InputImageData";
import { downloadString } from "@/core/utils/fileUtils";
import type { ImageEntry, PSImageDataSettingType } from "@/types/convert";

/**
 * Create an ImageEntry from a File with specified settings
 */
export const createImageEntry = async (
  file: File,
  opts: { originalPixelSize: number } & PSImageDataSettingType,
): Promise<ImageEntry> => {
  const image = await createPSImageData(file);
  image.originalPixelSize = opts.originalPixelSize;

  return {
    image,
    settings: {
      scaleSizePercent: opts.scaleSizePercent,
      scaleMode: opts.scaleMode,
    },
    errors: [],
  };
};

/**
 * Download an ImageEntry to the specified output path
 */
export const downloadImageEntry = async (
  targetEntry: ImageEntry,
  outputPath: string,
): Promise<void> => {
  await downloadString(
    targetEntry.image.url,
    targetEntry.image.data.name,
    outputPath,
  );
};

/**
 * Check if a file name already exists in the entry list
 */
export const isDuplicateFileName = (
  fileName: string,
  existingEntries: ImageEntry[],
): boolean => {
  return existingEntries.some((entry) => entry.image.data.name === fileName);
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
