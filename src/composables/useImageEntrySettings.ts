import { Ref } from "vue";

import { ImageCheckList } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";
import useImageEntryStore from "@/stores/imageEntryStore";

/**
 * Composable for applying settings to checked image entries
 */
const useImageEntrySettings = (checkedMap: Ref<ImageCheckList>) => {
  const store = useImageEntryStore();

  const applySettings = (
    scaleSizePercent: number,
    originalPixelSize: number,
    scaleMode: ScaleModeType,
  ) => {
    store.applySettingsToCheckedEntries(
      checkedMap.value,
      scaleSizePercent,
      originalPixelSize,
      scaleMode,
    );
  };

  return { applySettings };
};

export default useImageEntrySettings;
