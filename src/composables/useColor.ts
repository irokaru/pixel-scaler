import { readonly, ref } from "vue";

import {
  getColorsSettings,
  getColorSettings,
  setColorSettings,
} from "@/controllers/colorController";

export default function useColor() {
  const COLORS = getColorsSettings();
  const color = ref(getColorSettings());

  const updateColorKey = (key: string) => {
    setColorSettings(key);
    color.value = getColorSettings();
  };

  return { COLORS, color: readonly(color), updateColorKey };
}
