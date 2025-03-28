export const ScaleMode = {
  Smooth: "smooth",
  Nearest: "nearest",
} as const satisfies Record<string, string>;

// NOTE: label is i18n key
export const ScaleModes = [
  { label: "form.scale-modes.xbr", value: ScaleMode.Smooth },
  { label: "form.scale-modes.nn", value: ScaleMode.Nearest },
] as const satisfies {
  label: string;
  value: (typeof ScaleMode)[keyof typeof ScaleMode];
}[];

export const ScaleSizePercent = {
  Min: 100,
  Max: 10_000,
  Default: 200,
} as const satisfies Record<"Min" | "Max" | "Default", number>;

export const OriginalPixelSize = {
  Min: 1,
  Max: 100,
  Default: 1,
} as const satisfies Record<"Min" | "Max" | "Default", number>;
