import {
  Colors,
  ColorKeys,
  StorageKey,
  DefaultColorKeyName,
} from "@/core/config/colors";
import {
  hasLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "@/core/infrastructure/storage";
import type { ColorKey, ColorSettings } from "@/core/types/color";

export const getAllColors = (): Record<ColorKey, ColorSettings> => {
  return Colors;
};

export const loadColorKeyInStorage = (): ColorKey => {
  if (!hasLocalStorage(StorageKey)) {
    return DefaultColorKeyName;
  }

  const key = getLocalStorage(StorageKey) as string;

  return isColorKey(key) ? (key as ColorKey) : DefaultColorKeyName;
};

export const saveColorKey = (key: ColorKey) => {
  if (isColorKey(key)) {
    setLocalStorage(StorageKey, key);
  }
};

export const isColorKey = (key: string): key is ColorKey => {
  return (ColorKeys as readonly string[]).includes(key);
};
