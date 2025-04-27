import { Ref } from "vue";

import { ImageCheckList, ImageEntry } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";
import { getCheckedItems } from "@/utils/imageItemUtils";

const useImageEntrySettings = (
  imageEntryList: Ref<ImageEntry[]>,
  checkedMap: Ref<ImageCheckList>,
) => {
  const applySettings = (
    scaleSizePercent: number,
    originalPixelSize: number,
    scaleMode: ScaleModeType,
  ) => {
    const targets = getCheckedItems(imageEntryList.value, checkedMap.value);
    for (const entry of targets) {
      entry.settings.scaleSizePercent = scaleSizePercent;
      entry.image.originalPixelSize = originalPixelSize;
      entry.settings.scaleMode = scaleMode;
    }
  };

  return { applySettings };
};

export default useImageEntrySettings;
