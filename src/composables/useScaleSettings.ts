import { ref } from "vue";

import { ScaleModeType } from "@/@types/convert";
import { originalPixelSizeList, ScaleModes } from "@/constants/form";

const useScaleSettings = () => {
  const originalPixelSize = ref<number>(originalPixelSizeList[0].value);
  const scaleMode = ref<ScaleModeType>(ScaleModes[0].value);
  const scaleSizePercent = ref<number>(200);

  return { originalPixelSize, scaleMode, scaleSizePercent };
};

export default useScaleSettings;
