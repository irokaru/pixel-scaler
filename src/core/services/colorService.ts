import blue from "@/core/config/colors/blue.json";
import blue_dark from "@/core/config/colors/blue_dark.json";
import dark from "@/core/config/colors/dark.json";
import gray from "@/core/config/colors/gray.json";
import green from "@/core/config/colors/green.json";
import green_dark from "@/core/config/colors/green_dark.json";
import red from "@/core/config/colors/red.json";
import red_dark from "@/core/config/colors/red_dark.json";
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
const colors: Record<string, Color> = {
  red,
  blue,
  green,
  gray,
  red_dark,
  blue_dark,
  green_dark,
  dark,
} as const;

/**
 * Retrieves the list of colors.
 */
export const getAllColors = () => {
  return colors;
};

/**
 * Retrieves the color key from local storage.
 * @returns The color key.
 */
export const loadColorKeyInStorage = () => {
  if (!existsLocalStorage(StorageKey)) {
    return DefaultColorKeyName;
  }

  const key = getLocalStorage(StorageKey) ?? "";
  return existsColorKey(key) ? key : DefaultColorKeyName;
};

/**
 * Sets the color key in the local storage.
 *
 * @param key - The color key to set.
 */
export const saveColorKey = (key: string) => {
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
