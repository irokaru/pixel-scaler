import { ColorKey, ColorSettings } from "@/core/@types/color";
import {
  Colors,
  ColorKeys,
  StorageKey,
  DefaultColorKeyName,
} from "@/core/constants/color";
import {
  existsLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "@/core/infrastructure/storage";

export const getAllColors = (): Record<ColorKey, ColorSettings> => {
  return Colors;
};

export const loadColorKeyInStorage = (): ColorKey => {
  if (!existsLocalStorage(StorageKey)) {
    return DefaultColorKeyName;
  }

  const key = getLocalStorage(StorageKey) as string;

  return existsColorKey(key) ? (key as ColorKey) : DefaultColorKeyName;
};

export const saveColorKey = (key: ColorKey) => {
  if (existsColorKey(key)) {
    setLocalStorage(StorageKey, key);
  }
};

export const existsColorKey = (key: string): key is ColorKey => {
  return (ColorKeys as readonly string[]).includes(key);
};
