import { defineStore } from "pinia";

import { ImageEntry, ImageCheckList } from "@/@types/convert";
import { vueI18n } from "@/core/plugins/i18n";
import {
  convertImage,
  isDuplicateEntry,
} from "@/core/services/image/convertService";
import { filterEntriesByChecked } from "@/core/services/image/entryBatchService";
import { ScaleError } from "@/models/errors/ScaleError";
import { useErrorStore } from "@/stores/errorStore";
import { useInputImageStore } from "@/stores/inputImageStore";
import { useScaledImageStore } from "@/stores/scaledImageStore";

export const useConvertStore = defineStore("convert", () => {
  const convertOne = async (entry: ImageEntry): Promise<void> => {
    const errorStore = useErrorStore();
    const scaledImageStore = useScaledImageStore();
    const { settings } = entry;

    try {
      if (isDuplicateEntry(entry, scaledImageStore.entries)) {
        throw new ScaleError("duplicate-image-and-settings", {
          filename: entry.image.data.name,
          scaleSizePercent: settings.scaleSizePercent,
          scaleMode: vueI18n.global.t(`form.scale-modes.${settings.scaleMode}`),
        });
      }

      const scaledImageData = await convertImage(entry);
      const scaledEntry: ImageEntry = {
        image: scaledImageData,
        settings: { ...settings },
        errors: [],
      };

      scaledImageStore.addEntry(scaledEntry);
    } catch (error) {
      if (error instanceof ScaleError) {
        entry.errors.push(error.toObject());
      } else {
        errorStore.addError(error);
      }
    }
  };

  const convertOneByUuid = async (uuid: string): Promise<void> => {
    const inputImageStore = useInputImageStore();
    const entry = inputImageStore.entries.find((e) => e.image.uuid === uuid);
    if (!entry) return;
    await convertOne(entry);
  };

  const convertAnyChecked = async (
    checkedList: ImageCheckList,
  ): Promise<void> => {
    const inputImageStore = useInputImageStore();
    const checkedEntries = filterEntriesByChecked(
      inputImageStore.entries,
      checkedList,
    );

    for (const entry of checkedEntries) {
      await convertOne(entry);
    }
  };

  return {
    convertOne,
    convertOneByUuid,
    convertAnyChecked,
  };
});
