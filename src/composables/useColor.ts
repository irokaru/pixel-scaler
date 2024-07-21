import { readonly, ref, watch } from "vue";

import {
  getColorSettings,
  setColorSettingKey,
  getColorSettingKey,
} from "@/controllers/colorController";

// TODO: Properly separate this as it is being referenced by both App.vue and the component.
const useColor = () => {
  const themeColorKey = ref(getColorSettingKey());
  const themeColor = ref(getColorSettings());

  const updateColorKey = (key: string) => {
    setColorSettingKey(key);
    themeColor.value = getColorSettings();
  };

  watch(themeColorKey, (newColorKey: string) => updateColorKey(newColorKey));

  return { themeColorKey, themeColor: readonly(themeColor) };
};

export default useColor;
