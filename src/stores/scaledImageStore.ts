import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { ImageEntry, ImageCheckList } from "@/@types/convert";
import {
  filterEntriesByChecked,
  revokeEntryUrls,
} from "@/core/services/image/entryBatchService";
import { findEntryByUuid } from "@/core/services/image/entryService";
import { UnknownError } from "@/models/errors/UnknownError";
import useOutputPathStore from "@/stores/outputPathStore";
import {
  downloadString,
  createZipBlobFromScaledImages,
  downloadBlob,
} from "@/utils/fileUtils";

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

  const downloadEntry = (uuid: string): void => {
    const targetEntry = findEntryByUuid(uuid, entries.value);
    if (!targetEntry) {
      throw new UnknownError("ダウンロード対象のエントリーが見つかりません");
    }
    const outputPathStore = useOutputPathStore();
    downloadString(
      targetEntry.image.url,
      targetEntry.image.data.name,
      outputPathStore.outputPath,
    );
  };

  const deleteCheckedEntries = (checkedList: ImageCheckList): void => {
    const checkedEntries = filterEntriesByChecked(entries.value, checkedList);
    revokeEntryUrls(checkedEntries);
    const checkedUuids = new Set(checkedEntries.map((e) => e.image.uuid));
    entries.value = entries.value.filter(
      (entry) => !checkedUuids.has(entry.image.uuid),
    );
  };

  const downloadCheckedEntries = (checkedList: ImageCheckList): void => {
    const outputPathStore = useOutputPathStore();
    const checkedEntries = filterEntriesByChecked(entries.value, checkedList);
    for (const entry of checkedEntries) {
      downloadString(
        entry.image.url,
        entry.image.data.name,
        outputPathStore.outputPath,
      );
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
