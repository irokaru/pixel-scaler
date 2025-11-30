import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { ImageEntry, ImageCheckList } from "@/@types/convert";
import { CustomErrorObject } from "@/@types/error";
import { vueI18n } from "@/core/plugins/i18n";
import {
  convertImage,
  isDuplicateEntry,
} from "@/core/services/image/convertService";
import { ScaleError } from "@/models/errors/ScaleError";
import { UnknownError } from "@/models/errors/UnknownError";
import { getCheckedItems } from "@/utils/imageItemUtils";

const useImageEntryStore = defineStore("imageEntryStore", () => {
  // State
  const imageEntryList = ref<ImageEntry[]>([]);
  const scaledImageList = ref<ImageEntry[]>([]);
  const errors = ref<CustomErrorObject[]>([]);

  // Getters
  const isEmpty = computed(() => imageEntryList.value.length === 0);
  const scaledIsEmpty = computed(() => scaledImageList.value.length === 0);
  const hasErrors = computed(() => errors.value.length > 0);

  // Actions
  const addImageEntry = (entry: ImageEntry) => {
    imageEntryList.value.push(entry);
  };

  const removeImageEntry = (uuid: string) => {
    imageEntryList.value = imageEntryList.value.filter(
      (entry) => entry.image.uuid !== uuid,
    );
  };

  const removeScaledImageEntry = (uuid: string) => {
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
    // Actions
    addImageEntry,
    removeImageEntry,
    removeScaledImageEntry,
    addError,
    clearErrors,
    deleteOneError,
    convertOne,
    convertOneByUuid,
    convertAnyChecked,
    clearAll,
  };
});

export default useImageEntryStore;
