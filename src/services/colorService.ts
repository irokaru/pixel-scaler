import { Color } from "@/@types/color";
import blue from "@/config/colors/blue.json";
import blue_dark from "@/config/colors/blue_dark.json";
import dark from "@/config/colors/dark.json";
import gray from "@/config/colors/gray.json";
import green from "@/config/colors/green.json";
import green_dark from "@/config/colors/green_dark.json";
import red from "@/config/colors/red.json";
import red_dark from "@/config/colors/red_dark.json";
import {
  existsLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "@/core/infrastructure/storage";

const StorageKey = "color";
const DefaultColorKeyName = "red";

/**
 * Represents a collection of colors.
 */
export const colors: Record<string, Color> = {
  blue_dark,
  blue,
  dark,
  gray,
  green_dark,
  green,
  red_dark,
  red,
} as const;

/**
 * Array of color keys.
 */
export const colorKeys = Object.keys(colors);

/**
 * Retrieves the color key from local storage.
 * @returns The color key.
 */
export const getColorKey = () => {
  if (!existsLocalStorage(StorageKey)) {
    return DefaultColorKeyName;
  }

  const key = getLocalStorage(StorageKey) ?? "";
  return existsColorKey(key) ? key : DefaultColorKeyName;
};

/**
 * Retrieves the color settings based on the current color key.
 * @returns The color settings.
 */
export const getColorSettings = () => {
  return colors[getColorKey()];
};

/**
 * Sets the color key in the local storage.
 *
 * @param key - The color key to set.
 */
export const setColorKey = (key: string) => {
  if (existsColorKey(key)) {
    setLocalStorage(StorageKey, key);
  }
};

/**
 * Checks if a color key exists in the colors object.
 *
 * @param key - The color key to check.
 * @returns True if the color key exists, false otherwise.
 */
const existsColorKey = (key: string) => {
  return key in colors;
};
