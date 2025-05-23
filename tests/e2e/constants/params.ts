import {
  OriginalPixelSize,
  ScaleMode,
  ScaleSizePercent,
} from "@/constants/form";

export const ConvertOptsList = [
  {
    scaleSizePercent: 300,
    originalPixelSize: OriginalPixelSize.Default,
    scaleMode: ScaleMode.Smooth,
  },
  {
    scaleSizePercent: ScaleSizePercent.Default,
    originalPixelSize: 2,
    scaleMode: ScaleMode.Smooth,
  },
  {
    scaleSizePercent: ScaleSizePercent.Default,
    originalPixelSize: OriginalPixelSize.Default,
    scaleMode: ScaleMode.Nearest,
  },
  {
    scaleSizePercent: 300,
    originalPixelSize: OriginalPixelSize.Default,
    scaleMode: ScaleMode.Nearest,
  },
  {
    scaleSizePercent: ScaleSizePercent.Default,
    originalPixelSize: 2,
    scaleMode: ScaleMode.Nearest,
  },
  { scaleSizePercent: 300, originalPixelSize: 2, scaleMode: ScaleMode.Nearest },
] satisfies {
  scaleSizePercent: number;
  originalPixelSize: number;
  scaleMode: string;
}[];

export const ScaleSizePercentParams = {
  valid: [100, 200, 500],
  invalidMin: [-1, 99, 99.9, 100.9],
  invalidMax: [10_001, 10_000.2, 100_000],
};

export const OriginalPixelSizeParams = {
  valid: [1, 2, 3],
  invalidMin: [-1, 0],
  invalidMax: [101, 100.2, 100_000],
};
