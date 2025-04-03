import { Ref } from "vue";

import { ImageEntry } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";

const useImageEntrySettings = (imageEntryList: Ref<ImageEntry[]>) => {
  const applySettingsToImageEntryList = (
    scaleSizePercent: number,
    originalPixelSize: number,
    scaleMode: ScaleModeType,
  ) => {
    if (imageEntryList.value.length === 0) return;
    const isEvery = imageEntryList.value.every(
      (entry) => !entry.settings.checked,
    );
    const targetEntries = imageEntryList.value.filter(
      (entry) => isEvery || entry.settings.checked,
    );
    for (const entry of targetEntries) {
      entry.settings.scaleSizePercent = scaleSizePercent;
      entry.image.originalPixelSize = originalPixelSize;
      entry.settings.scaleMode = scaleMode;
    }
  };

  return { applySettingsToImageEntryList };
};

export default useImageEntrySettings;
