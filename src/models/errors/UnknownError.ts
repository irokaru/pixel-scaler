import { CustomErrorBase } from "./_ErrorBase";

export class UnknownError extends CustomErrorBase<
  "unknown",
  { message: string },
  "unknown"
> {
  readonly kind = "unknown" as const;
  constructor(message: string) {
    super("unknown", { message });
    this.name = "PixelScalerUnknownError";
  }
}
