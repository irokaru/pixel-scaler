import { ImageCheckList, ImageEntry } from "@/@types/convert";
import { getCheckedItems, isAllUnchecked } from "@/utils/imageItemUtils";
import { revokeObjectURL } from "@/utils/imageUtils";

/**
 * Filter entries based on checked state
 * If all items are unchecked, returns empty array (all items will be processed)
 * Otherwise, returns only checked items
 */
export const filterEntriesByChecked = (
  entries: ImageEntry[],
  checkedMap: ImageCheckList,
): ImageEntry[] => {
  const allUnchecked = isAllUnchecked(entries, checkedMap);

  if (allUnchecked) {
    return entries;
  }

  return getCheckedItems(entries, checkedMap);
};

/**
 * Get entries that should be kept (not deleted) based on checked state
 */
export const getUncheckedEntries = (
  entries: ImageEntry[],
  checkedMap: ImageCheckList,
): ImageEntry[] => {
  const allUnchecked = isAllUnchecked(entries, checkedMap);

  if (allUnchecked) {
    return [];
  }

  return entries.filter((entry) => !checkedMap[entry.image.uuid]);
};

/**
 * Revoke object URLs for multiple entries
 * Failures are silently ignored as recovery is not possible
 */
export const revokeEntryUrls = (entries: ImageEntry[]): void => {
  for (const entry of entries) {
    try {
      revokeObjectURL(entry.image.url);
    } catch {
      // Ignore errors as recovery is not possible
    }
  }
};

// TODO: Consider migrating downloadString and createZipBlobFromScaledImages
// from utils/fileUtils.ts to a dedicated fileService for better separation of concerns
