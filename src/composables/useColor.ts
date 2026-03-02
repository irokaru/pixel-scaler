import { ref, watch } from "vue";

import {
  loadColorKeyInStorage,
  saveColorKey,
} from "@/core/services/colorService";
import { ColorKey } from "@/core/types/color";

const useColor = () => {
  const themeColorKey = ref<ColorKey>(loadColorKeyInStorage());

  watch(
    themeColorKey,
    (newColorKey) => {
      saveColorKey(newColorKey);
      document.documentElement.dataset.colorTheme = newColorKey;
    },
    {
      immediate: true,
    },
  );

  return { themeColorKey };
};

export default useColor;
