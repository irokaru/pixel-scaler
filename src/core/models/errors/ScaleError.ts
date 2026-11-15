import { CustomErrorBase } from "./_ErrorBase";

type ScaleErrorCode =
  | "invalid-image-size"
  | "unsupported-scale-size"
  | "duplicate-image-and-settings";
type ScaleErrorParameter = Record<
  ScaleErrorCode,
  Record<string, string | number>
>;
interface ScaleErrorParameters extends ScaleErrorParameter {
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
> extends CustomErrorBase<ScaleErrorCode, ScaleErrorParameters[C], "scale"> {
  readonly kind = "scale" as const;

  constructor(code: C, parameters: ScaleErrorParameters[C]) {
    super(code, parameters);
    this.name = "PixelScalerScaleError";
  }
}
