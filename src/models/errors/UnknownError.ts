import { CustomErrorBase } from "./_ErrorBase";

export class UnknownError extends CustomErrorBase<
  "unknown",
  { message: string },
  "unknown"
> {
  readonly kind = "unknown" as const;
  constructor(error: unknown) {
    const message =
      error instanceof Error
        ? UnknownError.toJSON(error)
        : JSON.stringify(error);
    super("unknown", { message });
    this.name = "PixelScalerUnknownError";
  }

  protected static toJSON(error: Error) {
    return JSON.stringify({
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }
}
