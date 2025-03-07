type ScaleErrorCode = "invalid-image-size" | "unsupported-scale-size";
type ScaleErrorParam = Record<ScaleErrorCode, Record<string, string | number>>;
interface ScaleErrorParams extends ScaleErrorParam {
  "invalid-image-size": { originalPixelSize: number };
  "unsupported-scale-size": { scaleSizePercent: number };
}

export class ScaleError extends Error {
  constructor(
    public code: ScaleErrorCode,
    public params: ScaleErrorParams[ScaleErrorCode],
  ) {
    super(code);
    this.name = "ScaleError";
  }
}
