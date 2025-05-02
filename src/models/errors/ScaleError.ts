import { ErrorKind } from "@/@types/error";

import { CustomErrorBase } from "./_ErrorBase";

type ScaleErrorCode =
  | "invalid-image-size"
  | "unsupported-scale-size"
  | "duplicate-image-and-settings";
type ScaleErrorParam = Record<ScaleErrorCode, Record<string, string | number>>;
interface ScaleErrorParams extends ScaleErrorParam {
  "invalid-image-size": { originalPixelSize: number };
  "unsupported-scale-size": { scaleSizePercent: number };
  "duplicate-image-and-settings": {
    scaleSizePercent: number;
    scaleMode: string;
  };
}

export class ScaleError<
  C extends ScaleErrorCode = ScaleErrorCode,
> extends CustomErrorBase<ScaleErrorCode, ScaleErrorParams[C]> {
  protected kind: ErrorKind = "scale" as const;

  constructor(
    public code: C,
    public params: ScaleErrorParams[C],
  ) {
    super(code, params);
    this.name = "PixelScalerScaleError";
  }
}
