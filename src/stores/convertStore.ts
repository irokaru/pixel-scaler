import { defineStore } from "pinia";

import { ScaleError } from "@/core/models/errors/ScaleError";
import {
  convertImage,
  isDuplicateEntry,
} from "@/core/services/image/convertService";
import { filterEntriesByChecked } from "@/core/services/image/entryBatchService";
import { vueI18n } from "@/plugins/i18n";
import { useErrorStore } from "@/stores/errorStore";
import { useInputImageStore } from "@/stores/inputImageStore";
import { useScaledImageStore } from "@/stores/scaledImageStore";
import { ImageEntry, ImageCheckList } from "@/types/convert";

export const useConvertStore = defineStore("convert", () => {
  const buildScaledEntry = async (
    entry: ImageEntry,
  ): Promise<ImageEntry | null> => {
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
      scaledImageData.imageData = null; // discard pixel data to free memory

      return {
        image: scaledImageData,
        settings: { ...settings },
        errors: [],
      };
    } catch (error) {
      if (error instanceof ScaleError) {
        entry.errors.push(error.toObject());
      } else {
        errorStore.addError(error);
      }
      return null;
    }
  };

  const convertOne = async (entry: ImageEntry): Promise<void> => {
    const scaledImageStore = useScaledImageStore();
    const scaledEntry = await buildScaledEntry(entry);
    if (scaledEntry !== null) {
      scaledImageStore.addEntry(scaledEntry);
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

    // Run conversions in parallel; results array preserves input order
    const results = await Promise.allSettled(
      checkedEntries.map((entry) => buildScaledEntry(entry)),
    );

    const scaledImageStore = useScaledImageStore();
    for (const result of results) {
      if (result.status === "fulfilled" && result.value !== null) {
        scaledImageStore.addEntry(result.value);
      }
    }
  };

  return {
    convertOne,
    convertOneByUuid,
    convertAnyChecked,
  };
});
