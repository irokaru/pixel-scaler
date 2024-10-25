import { readonly, ref, watch } from "vue";

import {
  loadColorKeyInStorage,
  getColorSettings,
  saveColorKey,
} from "@/core/services/colorService";

// TODO: Properly separate this as it is being referenced by both App.vue and the component.
const useColor = () => {
  const themeColorKey = ref(loadColorKeyInStorage());
  const themeColor = ref(getColorSettings());

  const updateColorKey = (key: string) => {
    saveColorKey(key);
    themeColor.value = getColorSettings();
  };

  watch(themeColorKey, (newColorKey: string) => updateColorKey(newColorKey));

  return { themeColorKey, themeColor: readonly(themeColor) };
};

export default useColor;
