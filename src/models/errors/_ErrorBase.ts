import { PSCustomErrorKind, PSCustomErrorObject } from "@/@types/error";

export abstract class PSCustomError extends Error {
  protected abstract kind: PSCustomErrorKind;

  constructor(
    public code: string,
    public params: Record<string, string | number>,
  ) {
    super(code);
    this.name = "PixelScalerError";
  }

  public toObject(): PSCustomErrorObject {
    return { key: `error.${this.code}`, params: this.params, kind: this.kind };
  }
}
