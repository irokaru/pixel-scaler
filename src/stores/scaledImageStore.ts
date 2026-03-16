import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { UnknownError } from "@/core/models/errors/UnknownError";
import {
  filterEntriesByChecked,
  revokeEntryUrls,
} from "@/core/services/image/entryBatchService";
import {
  downloadImageEntry,
  findEntryByUuid,
} from "@/core/services/image/entryService";
import {
  createZipBlobFromScaledImages,
  downloadBlob,
} from "@/core/utils/fileUtils";
import useOutputPathStore from "@/stores/outputPathStore";
import type { ImageEntry, ImageCheckList } from "@/types/convert";

export const useScaledImageStore = defineStore("scaledImage", () => {
  const entries = ref<ImageEntry[]>([]);

  const isEmpty = computed(() => entries.value.length === 0);

  const addEntry = (entry: ImageEntry): void => {
    entries.value.push(entry);
  };

  const removeEntry = (uuid: string): void => {
    const targetEntry = findEntryByUuid(uuid, entries.value);
    if (targetEntry) {
      URL.revokeObjectURL(targetEntry.image.url);
      entries.value = entries.value.filter(
        (entry) => entry.image.uuid !== uuid,
      );
    }
  };

  const clearEntryErrors = (uuid: string): void => {
    const targetEntry = findEntryByUuid(uuid, entries.value);
    if (targetEntry) {
      targetEntry.errors = [];
    }
  };

  const downloadEntry = async (uuid: string): Promise<void> => {
    const targetEntry = findEntryByUuid(uuid, entries.value);
    if (!targetEntry) {
      throw new UnknownError("entry not found for download");
    }
    await downloadImageEntry(targetEntry, useOutputPathStore().outputPath);
  };

  const deleteCheckedEntries = (checkedList: ImageCheckList): void => {
    const checkedEntries = filterEntriesByChecked(entries.value, checkedList);
    revokeEntryUrls(checkedEntries);
    const checkedUuids = new Set(checkedEntries.map((e) => e.image.uuid));
    entries.value = entries.value.filter(
      (entry) => !checkedUuids.has(entry.image.uuid),
    );
  };

  const downloadCheckedEntries = async (
    checkedList: ImageCheckList,
  ): Promise<void> => {
    const outputPathStore = useOutputPathStore();
    const checkedEntries = filterEntriesByChecked(entries.value, checkedList);
    for (const entry of checkedEntries) {
      await downloadImageEntry(entry, outputPathStore.outputPath);
    }
  };

  const downloadCheckedEntriesZip = async (
    checkedList: ImageCheckList,
  ): Promise<void> => {
    const checkedEntries = filterEntriesByChecked(entries.value, checkedList);
    const zipBlob = await createZipBlobFromScaledImages(checkedEntries);
    downloadBlob(zipBlob, "images.zip");
  };

  const clearAll = (): void => {
    revokeEntryUrls(entries.value);
    entries.value = [];
  };

  return {
    entries,
    isEmpty,
    addEntry,
    removeEntry,
    clearEntryErrors,
    downloadEntry,
    deleteCheckedEntries,
    downloadCheckedEntries,
    downloadCheckedEntriesZip,
    clearAll,
  };
});
