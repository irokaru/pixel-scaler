import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
  ImageEntry,
  ImageCheckList,
  PSImageDataSettingType,
} from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";
import {
  filterEntriesByChecked,
  revokeEntryUrls,
} from "@/core/services/image/entryBatchService";
import {
  createImageEntry,
  findEntryByUuid,
  isDuplicateUrl,
} from "@/core/services/image/entryService";
import { FileError } from "@/models/errors/FileError";
import useOutputPathStore from "@/stores/outputPathStore";
import {
  downloadString,
  createZipBlobFromScaledImages,
  downloadBlob,
} from "@/utils/fileUtils";

export const useInputImageStore = defineStore("inputImage", () => {
  const entries = ref<ImageEntry[]>([]);

  const isEmpty = computed(() => entries.value.length === 0);

  const addEntry = (entry: ImageEntry): void => {
    entries.value.push(entry);
  };

  const addEntryFromFile = async (
    file: File,
    opts: { originalPixelSize: number } & PSImageDataSettingType,
  ): Promise<void> => {
    const entry = await createImageEntry(file, opts);
    if (isDuplicateUrl(entry.image.url, entries.value)) {
      throw new FileError("duplicate-image", { filename: file.name });
    }
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
      return;
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

  const applySettingsToCheckedEntries = (
    checkedList: ImageCheckList,
    settings: PSImageDataSettingType & {
      scaleMode: ScaleModeType;
      originalPixelSize: number;
    },
  ): void => {
    const checkedEntries = filterEntriesByChecked(entries.value, checkedList);
    for (const entry of checkedEntries) {
      entry.settings = {
        ...entry.settings,
        scaleSizePercent: settings.scaleSizePercent,
        scaleMode: settings.scaleMode,
      };
      entry.image.originalPixelSize = settings.originalPixelSize;
    }
  };

  const clearAll = (): void => {
    revokeEntryUrls(entries.value);
    entries.value = [];
  };

  return {
    entries,
    isEmpty,
    addEntry,
    addEntryFromFile,
    removeEntry,
    clearEntryErrors,
    downloadEntry,
    deleteCheckedEntries,
    downloadCheckedEntries,
    downloadCheckedEntriesZip,
    applySettingsToCheckedEntries,
    clearAll,
  };
});
