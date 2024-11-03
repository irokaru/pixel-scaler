export const originalPixelSizeList: { label: string; value: number }[] = [
  { label: "1px", value: 1 },
  { label: "2px", value: 2 },
  { label: "3px", value: 3 },
  { label: "4px", value: 4 },
] as const;

export const ScaleModeSmoothKey = "smooth" as const;
export const ScaleModeNearestKey = "nearest" as const;
export const ScaleMode = [
  ScaleModeSmoothKey,
  ScaleModeNearestKey,
] as const satisfies string[];
export type ScaleModeType = (typeof ScaleMode)[number];

// NOTE: label is i18n key
export const ScaleModes: { label: string; value: ScaleModeType }[] = [
  { label: "form.scale-modes.xbr", value: ScaleModeSmoothKey },
  { label: "form.scale-modes.nn", value: ScaleModeNearestKey },
] as const;

export const ScaleSizePercentMin = 100 as const;
export const ScaleSizePercentMax = 800 as const;
