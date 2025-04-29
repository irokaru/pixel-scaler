import { ref, watch } from "vue";

import { ColorKey } from "@/core/@types/color";
import {
  loadColorKeyInStorage,
  saveColorKey,
} from "@/core/services/colorService";

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
