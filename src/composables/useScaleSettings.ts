import { ref } from "vue";

import { ScaleModeType } from "@/@types/form";
import {
  OriginalPixelSize,
  ScaleModes,
  ScaleSizePercent,
} from "@/constants/form";

const useScaleSettings = () => {
  const originalPixelSize = ref<number>(OriginalPixelSize.Default);
  const scaleMode = ref<ScaleModeType>(ScaleModes[0].value);
  const scaleSizePercent = ref<number>(ScaleSizePercent.Default);

  return { originalPixelSize, scaleMode, scaleSizePercent };
};

export default useScaleSettings;
