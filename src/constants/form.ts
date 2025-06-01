import {
  ResultDisplayStyleType,
  ScaleModeType,
  ScaleParameterType,
} from "@/@types/form";

import { FontAwesomeIcons } from "./icon";

export const ScaleMode = {
  Smooth: "smooth",
  Nearest: "nearest",
} as const satisfies Record<string, ScaleModeType>;

// NOTE: label is i18n key
export const ScaleModes = [
  { label: "form.scale-modes.smooth", value: ScaleMode.Smooth },
  { label: "form.scale-modes.nearest", value: ScaleMode.Nearest },
] as const satisfies {
  label: string;
  value: ScaleModeType;
}[];

export const ScaleSizePercent = {
  Min: 100,
  Max: 10_000,
  Default: 200,
} as const satisfies ScaleParameterType;

export const OriginalPixelSize = {
  Min: 1,
  Max: 100,
  Default: 1,
} as const satisfies ScaleParameterType;

export const ResultDisplayStyles = {
  Grid: "grid",
  List: "list",
} as const satisfies Record<string, ResultDisplayStyleType>;

export const ResultDisplayStyleOptions = [
  {
    prefixIcon: "fa-grid",
    label: "form.result-display-style.grid",
    value: ResultDisplayStyles.Grid,
  },
  {
    prefixIcon: "fa-list",
    label: "form.result-display-style.list",
    value: ResultDisplayStyles.List,
  },
] as const satisfies {
  prefixIcon: keyof typeof FontAwesomeIcons;
  label: string;
  value: ResultDisplayStyleType;
}[];

export const OutputPathStorageKey = "output-path";
