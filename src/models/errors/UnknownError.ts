import { ErrorKind } from "@/@types/error";

import { CustomErrorBase } from "./_ErrorBase";

export class UnknownError extends CustomErrorBase<
  "unknown",
  { message: string }
> {
  protected kind: ErrorKind = "unknown" as const;
  constructor(message: string) {
    super("unknown", { message });
    this.name = "PixelScalerUnknownError";
  }
}
