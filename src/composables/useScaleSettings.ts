import { ref } from "vue";

import { ScaleModeType } from "@/@types/convert";
import {
  OriginalPixelSizeMin,
  ScaleModes,
  ScaleSizePercentDefault,
} from "@/constants/form";

const useScaleSettings = () => {
  const originalPixelSize = ref<number>(OriginalPixelSizeMin);
  const scaleMode = ref<ScaleModeType>(ScaleModes[0].value);
  const scaleSizePercent = ref<number>(ScaleSizePercentDefault);

  return { originalPixelSize, scaleMode, scaleSizePercent };
};

export default useScaleSettings;
