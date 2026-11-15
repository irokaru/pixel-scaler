import {
  getCheckedItems,
  isAllUnchecked,
} from "@/core/utils/imageItemUtilities";
import { revokeObjectURL } from "@/core/utils/imageUtilities";
import type { ImageCheckList, ImageEntry } from "@/types/convert";

/**
Filter entries based on checked state
If all items are unchecked, returns empty array (all items will be processed)
Otherwise, returns only checked items
*/
export const filterEntriesByChecked = (
  entries: ImageEntry[],
  checkedMap: ImageCheckList,
): ImageEntry[] => {
  const allUnchecked = isAllUnchecked(entries, checkedMap);

  return allUnchecked ? entries : getCheckedItems(entries, checkedMap);
};

/**
Get entries that should be kept (not deleted) based on checked state
*/
export const getUncheckedEntries = (
  entries: ImageEntry[],
  checkedMap: ImageCheckList,
): ImageEntry[] => {
  const allUnchecked = isAllUnchecked(entries, checkedMap);

  return allUnchecked
    ? []
    : entries.filter((entry) => checkedMap[entry.image.uuid] !== true);
};

/**
Revoke object URLs for multiple entries
Failures are silently ignored as recovery is not possible
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
// from utils/fileUtilities.ts to a dedicated fileService for better separation of concerns
