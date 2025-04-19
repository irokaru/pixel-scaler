import { Ref } from "vue";

import { ImageCheckList, ImageEntry } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";

const useImageEntrySettings = (
  imageEntryList: Ref<ImageEntry[]>,
  checkedMap: Ref<ImageCheckList>,
) => {
  const getTargetEntries = (): ImageEntry[] => {
    const allUnchecked = imageEntryList.value.every(
      (entry) => !checkedMap.value[entry.image.uuid],
    );

    return imageEntryList.value.filter(
      (entry) => allUnchecked || checkedMap.value[entry.image.uuid],
    );
  };

  const applySettings = (
    scaleSizePercent: number,
    originalPixelSize: number,
    scaleMode: ScaleModeType,
  ) => {
    const targets = getTargetEntries();
    for (const entry of targets) {
      entry.settings.scaleSizePercent = scaleSizePercent;
      entry.image.originalPixelSize = originalPixelSize;
      entry.settings.scaleMode = scaleMode;
    }
  };

  return { applySettings };
};

export default useImageEntrySettings;
