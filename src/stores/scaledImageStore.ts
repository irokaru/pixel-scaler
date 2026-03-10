import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { InputError } from "@/core/models/errors/InputError";
import {
  filterEntriesByChecked,
  revokeEntryUrls,
} from "@/core/services/image/entryBatchService";
import { findEntryByUuid } from "@/core/services/image/entryService";
import {
  downloadString,
  downloadBytes,
  createZipBlobFromScaledImages,
  downloadBlob,
} from "@/core/utils/fileUtils";
import useOutputPathStore from "@/stores/outputPathStore";
import { ImageEntry, ImageCheckList } from "@/types/convert";

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
      throw new InputError("file-not-found", { filename: uuid });
    }
    const outputPathStore = useOutputPathStore();
    if (targetEntry.image.data.type === "image/gif") {
      const bytes = new Uint8Array(await targetEntry.image.data.arrayBuffer());
      await downloadBytes(
        bytes,
        targetEntry.image.data.name,
        outputPathStore.outputPath,
      );
    } else {
      downloadString(
        targetEntry.image.url,
        targetEntry.image.data.name,
        outputPathStore.outputPath,
      );
    }
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
      if (entry.image.data.type === "image/gif") {
        const bytes = new Uint8Array(await entry.image.data.arrayBuffer());
        await downloadBytes(
          bytes,
          entry.image.data.name,
          outputPathStore.outputPath,
        );
      } else {
        downloadString(
          entry.image.url,
          entry.image.data.name,
          outputPathStore.outputPath,
        );
      }
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
