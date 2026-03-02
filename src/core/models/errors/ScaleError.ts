import { CustomErrorBase } from "./_ErrorBase";

type ScaleErrorCode =
  | "invalid-image-size"
  | "unsupported-scale-size"
  | "duplicate-image-and-settings";
type ScaleErrorParam = Record<ScaleErrorCode, Record<string, string | number>>;
interface ScaleErrorParams extends ScaleErrorParam {
  "invalid-image-size": { filename: string; originalPixelSize: number };
  "unsupported-scale-size": { scaleSizePercent: number };
  "duplicate-image-and-settings": {
    filename: string;
    scaleSizePercent: number;
    scaleMode: string;
  };
}

export class ScaleError<
  C extends ScaleErrorCode = ScaleErrorCode,
> extends CustomErrorBase<ScaleErrorCode, ScaleErrorParams[C], "scale"> {
  readonly kind = "scale" as const;

  constructor(
    public code: C,
    public params: ScaleErrorParams[C],
  ) {
    super(code, params);
    this.name = "PixelScalerScaleError";
  }
}
