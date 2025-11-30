import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
  ImageEntry,
  ImageCheckList,
  PSImageDataSettingType,
} from "@/@types/convert";
import { CustomErrorObject } from "@/@types/error";
import { ScaleModeType } from "@/@types/form";
import { vueI18n } from "@/core/plugins/i18n";
import {
  convertImage,
  isDuplicateEntry,
} from "@/core/services/image/convertService";
import {
  filterEntriesByChecked,
  revokeEntryUrls,
} from "@/core/services/image/entryBatchService";
import {
  createImageEntry,
  findEntryByUuid,
  isDuplicateUrl,
} from "@/core/services/image/entryService";
import { CustomErrorBase } from "@/models/errors/_ErrorBase";
import { FileError } from "@/models/errors/FileError";
import { ScaleError } from "@/models/errors/ScaleError";
import { UnknownError } from "@/models/errors/UnknownError";
import {
  downloadString,
  createZipBlobFromScaledImages,
  downloadBlob,
} from "@/utils/fileUtils";
import { getCheckedItems } from "@/utils/imageItemUtils";

import useOutputPathStore from "./outputPathStore";

// TODO: Future consideration: split into inputImageStore and scaledImageStore for better separation of concerns

const useImageEntryStore = defineStore("imageEntryStore", () => {
  // State
  const imageEntryList = ref<ImageEntry[]>([]);
  const scaledImageList = ref<ImageEntry[]>([]);
  const errors = ref<CustomErrorObject[]>([]);

  // Getters
  const isEmpty = computed(() => imageEntryList.value.length === 0);
  const scaledIsEmpty = computed(() => scaledImageList.value.length === 0);
  const hasErrors = computed(() => errors.value.length > 0);
  const isInputEmpty = computed(() => imageEntryList.value.length === 0);
  const isScaledEmpty = computed(() => scaledImageList.value.length === 0);

  // Actions
  const addImageEntry = (entry: ImageEntry) => {
    imageEntryList.value.push(entry);
  };

  const addInputImageEntry = async (
    file: File,
    opts: { originalPixelSize: number } & PSImageDataSettingType,
  ) => {
    try {
      // TODO: Consider error-type-specific handling in the future
      const entry = await createImageEntry(file, opts);

      // Check for duplicate URL
      if (isDuplicateUrl(entry.image.url, imageEntryList.value)) {
        throw new FileError("duplicate-image", { filename: file.name });
      }

      imageEntryList.value.push(entry);
    } catch (error) {
      if (error instanceof CustomErrorBase) {
        errors.value.push(error.toObject());
      } else {
        errors.value.push(new UnknownError(error).toObject());
      }
    }
  };

  const removeImageEntry = (uuid: string) => {
    const entry = findEntryByUuid(uuid, imageEntryList.value);
    if (entry) {
      revokeEntryUrls([entry]);
    }
    imageEntryList.value = imageEntryList.value.filter(
      (entry) => entry.image.uuid !== uuid,
    );
  };

  const removeScaledImageEntry = (uuid: string) => {
    const entry = findEntryByUuid(uuid, scaledImageList.value);
    if (entry) {
      revokeEntryUrls([entry]);
    }
    scaledImageList.value = scaledImageList.value.filter(
      (entry) => entry.image.uuid !== uuid,
    );
  };

  const addError = (error: CustomErrorObject) => {
    errors.value.push(error);
  };

  const clearErrors = (targetKinds: CustomErrorObject["kind"][] = []) => {
    errors.value =
      targetKinds.length > 0
        ? errors.value.filter((error) => !targetKinds.includes(error.kind))
        : [];
  };

  const deleteOneError = (uuid: string) => {
    errors.value = errors.value.filter((error) => error.uuid !== uuid);
  };

  const clearInputImageEntryErrors = (uuid: string) => {
    const entry = findEntryByUuid(uuid, imageEntryList.value);
    if (entry) {
      entry.errors = [];
    }
  };

  const clearScaledImageEntryErrors = (uuid: string) => {
    const entry = findEntryByUuid(uuid, scaledImageList.value);
    if (entry) {
      entry.errors = [];
    }
  };

  const downloadInputImageEntry = (uuid: string) => {
    const entry = findEntryByUuid(uuid, imageEntryList.value);
    if (!entry) return;
    const outputPathStore = useOutputPathStore();
    downloadString(
      entry.image.url,
      entry.image.data.name,
      outputPathStore.outputPath,
    );
  };

  const downloadScaledImageEntry = (uuid: string) => {
    const entry = findEntryByUuid(uuid, scaledImageList.value);
    if (!entry) return;
    const outputPathStore = useOutputPathStore();
    downloadString(
      entry.image.url,
      entry.image.data.name,
      outputPathStore.outputPath,
    );
  };

  const deleteCheckedInputEntries = (checkedMap: ImageCheckList) => {
    const toDelete = filterEntriesByChecked(imageEntryList.value, checkedMap);
    revokeEntryUrls(toDelete);
    imageEntryList.value = imageEntryList.value.filter(
      (entry) => !toDelete.includes(entry),
    );
  };

  const deleteCheckedScaledEntries = (checkedMap: ImageCheckList) => {
    const toDelete = filterEntriesByChecked(scaledImageList.value, checkedMap);
    revokeEntryUrls(toDelete);
    scaledImageList.value = scaledImageList.value.filter(
      (entry) => !toDelete.includes(entry),
    );
  };

  const downloadCheckedInputEntries = (checkedMap: ImageCheckList) => {
    const targets = getCheckedItems(imageEntryList.value, checkedMap);
    const outputPathStore = useOutputPathStore();
    for (const { image } of targets) {
      downloadString(image.url, image.data.name, outputPathStore.outputPath);
    }
  };

  const downloadCheckedScaledEntries = (checkedMap: ImageCheckList) => {
    const targets = getCheckedItems(scaledImageList.value, checkedMap);
    const outputPathStore = useOutputPathStore();
    for (const { image } of targets) {
      downloadString(image.url, image.data.name, outputPathStore.outputPath);
    }
  };

  const downloadCheckedInputEntriesZip = async (checkedMap: ImageCheckList) => {
    const targets = getCheckedItems(imageEntryList.value, checkedMap);
    const zipBlob = await createZipBlobFromScaledImages(targets);
    downloadBlob(zipBlob, "images.zip");
  };

  const downloadCheckedScaledEntriesZip = async (
    checkedMap: ImageCheckList,
  ) => {
    const targets = getCheckedItems(scaledImageList.value, checkedMap);
    const zipBlob = await createZipBlobFromScaledImages(targets);
    downloadBlob(zipBlob, "images.zip");
  };

  const convertOne = async (entry: ImageEntry): Promise<void> => {
    const { image, settings } = entry;

    try {
      if (isDuplicateEntry(entry, scaledImageList.value)) {
        throw new ScaleError("duplicate-image-and-settings", {
          filename: image.data.name,
          scaleSizePercent: settings.scaleSizePercent,
          // FIXME: reflected to selected language when modify i18n
          scaleMode: vueI18n.global.t(`form.scale-modes.${settings.scaleMode}`),
        });
      }

      const scaledImage = await convertImage(entry);

      const result: ImageEntry = {
        image: scaledImage,
        settings: { ...settings },
        errors: [],
      };

      scaledImageList.value.push(result);
    } catch (error) {
      // NOTE: scale methods throw ScaleError
      if (error instanceof ScaleError) {
        entry.errors.push(error.toObject());
      } else {
        errors.value.push(new UnknownError(error).toObject());
      }
    }
  };

  const convertOneByUuid = async (uuid: string): Promise<void> => {
    const entry = imageEntryList.value.find(
      (entry) => entry.image.uuid === uuid,
    );
    if (!entry) return;
    return await convertOne(entry);
  };

  const convertAnyChecked = async (checkedMap: ImageCheckList) => {
    const targets = getCheckedItems(imageEntryList.value, checkedMap);

    for (const entry of targets) {
      await convertOne(entry);
    }
  };

  const applySettingsToCheckedEntries = (
    checkedMap: ImageCheckList,
    scaleSizePercent: number,
    originalPixelSize: number,
    scaleMode: ScaleModeType,
  ) => {
    const targets = getCheckedItems(imageEntryList.value, checkedMap);
    for (const entry of targets) {
      entry.settings.scaleSizePercent = scaleSizePercent;
      entry.image.originalPixelSize = originalPixelSize;
      entry.settings.scaleMode = scaleMode;
    }
  };

  const clearAll = () => {
    imageEntryList.value = [];
    scaledImageList.value = [];
    errors.value = [];
  };

  return {
    // State
    imageEntryList,
    scaledImageList,
    errors,
    // Getters
    isEmpty,
    scaledIsEmpty,
    hasErrors,
    isInputEmpty,
    isScaledEmpty,
    // Actions
    addImageEntry,
    addInputImageEntry,
    removeImageEntry,
    removeScaledImageEntry,
    addError,
    clearErrors,
    deleteOneError,
    clearInputImageEntryErrors,
    clearScaledImageEntryErrors,
    downloadInputImageEntry,
    downloadScaledImageEntry,
    deleteCheckedInputEntries,
    deleteCheckedScaledEntries,
    downloadCheckedInputEntries,
    downloadCheckedScaledEntries,
    downloadCheckedInputEntriesZip,
    downloadCheckedScaledEntriesZip,
    convertOne,
    convertOneByUuid,
    convertAnyChecked,
    applySettingsToCheckedEntries,
    clearAll,
  };
});

export default useImageEntryStore;
