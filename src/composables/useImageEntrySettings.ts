import { Ref } from "vue";

import { ImageCheckList, ImageEntry } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";

const useImageEntrySettings = (
  imageEntryList: Ref<ImageEntry[]>,
  checkedMap: Ref<ImageCheckList>,
) => {
  const applySettingsToImageEntryList = (
    scaleSizePercent: number,
    originalPixelSize: number,
    scaleMode: ScaleModeType,
  ) => {
    if (imageEntryList.value.length === 0) return;
    const isEvery = imageEntryList.value.every(
      (entry) => !checkedMap.value[entry.image.uuid],
    );
    const targetEntries = imageEntryList.value.filter(
      (entry) => isEvery || checkedMap.value[entry.image.uuid],
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
