export const ScaleModeSmoothKey = "smooth" as const;
export const ScaleModeNearestKey = "nearest" as const;
export const ScaleMode = [
  ScaleModeSmoothKey,
  ScaleModeNearestKey,
] as const satisfies string[];

// NOTE: label is i18n key
export const ScaleModes = [
  { label: "form.scale-modes.xbr", value: ScaleModeSmoothKey },
  { label: "form.scale-modes.nn", value: ScaleModeNearestKey },
] as const satisfies { label: string; value: string }[];

export const ScaleSizePercentMin = 100 as const;
export const ScaleSizePercentMax = 10_000 as const;
export const OriginalPixelSizeMin = 1 as const;
export const OriginalPixelSizeMax = 100 as const;
