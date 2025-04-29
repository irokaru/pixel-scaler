import blue from "@/core/config/colors/blue.json";
import blue_dark from "@/core/config/colors/blue_dark.json";
import dark from "@/core/config/colors/dark.json";
import gray from "@/core/config/colors/gray.json";
import green from "@/core/config/colors/green.json";
import green_dark from "@/core/config/colors/green_dark.json";
import red from "@/core/config/colors/red.json";
import red_dark from "@/core/config/colors/red_dark.json";

import { ColorKey, ColorSettings } from "../@types/color";

export const StorageKey = "color";
export const DefaultColorKeyName: ColorKey = "red";

export const ColorKeys: ColorKey[] = [
  "red",
  "blue",
  "green",
  "gray",
  "red_dark",
  "blue_dark",
  "green_dark",
  "dark",
] as const;

/**
 * Represents a collection of colors.
 */
export const Colors: Record<ColorKey, ColorSettings> = {
  red,
  blue,
  green,
  gray,
  red_dark,
  blue_dark,
  green_dark,
  dark,
} as const;
