import { ref, watch } from "vue";

import {
  loadColorKeyInStorage,
  saveColorKey,
} from "@/core/services/colorService";

// TODO: Properly separate this as it is being referenced by both App.vue and the component.
const useColor = () => {
  const themeColorKey = ref(loadColorKeyInStorage());

  const updateColorKey = (key: string) => {
    saveColorKey(key);
    document.documentElement.dataset.colorTheme = key;
  };

  watch(themeColorKey, (newColorKey: string) => updateColorKey(newColorKey), {
    immediate: true,
  });

  return { themeColorKey };
};

export default useColor;
