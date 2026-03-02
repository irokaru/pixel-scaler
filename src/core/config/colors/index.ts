import { ColorKey, ColorSettings } from "@/core/types/color";

import blue from "./blue.json" with { type: "json" };
import blue_dark from "./blue_dark.json" with { type: "json" };
import dark from "./dark.json" with { type: "json" };
import gray from "./gray.json" with { type: "json" };
import green from "./green.json" with { type: "json" };
import green_dark from "./green_dark.json" with { type: "json" };
import red from "./red.json" with { type: "json" };
import red_dark from "./red_dark.json" with { type: "json" };

export const StorageKey = "color";
export const DefaultColorKeyName: ColorKey = "red";

export const ColorKeys: readonly ColorKey[] = [
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
