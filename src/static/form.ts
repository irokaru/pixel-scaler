export const originalPixelSizeList: { label: string; value: number }[] = [
  { label: "1px", value: 1 },
  { label: "2px", value: 2 },
  { label: "3px", value: 3 },
  { label: "4px", value: 4 },
] as const;

export const ScaleMode = ["smooth", "nearest"] as const;
export type ScaleModeType = (typeof ScaleMode)[number];

// NOTE: label is i18n key
export const ScaleModes: { label: string; value: ScaleModeType }[] = [
  { label: "form.scale-modes.xbr", value: "smooth" },
  { label: "form.scale-modes.nn", value: "nearest" },
] as const;

export const scaleSizePercentMin = 100 as const;
export const scaleSizePercentMax = 800 as const;
