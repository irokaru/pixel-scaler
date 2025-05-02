import { ErrorKind, CustomErrorObject } from "@/@types/error";

export abstract class CustomErrorBase extends Error {
  protected abstract kind: ErrorKind;

  constructor(
    public code: string,
    public params: Record<string, string | number>,
  ) {
    super(code);
    this.name = "PixelScalerError";
  }

  public toObject(): CustomErrorObject {
    return { code: `error.${this.code}`, params: this.params, kind: this.kind };
  }
}
