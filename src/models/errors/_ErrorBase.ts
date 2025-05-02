import { ErrorKind, CustomErrorObject, ErrorParams } from "@/@types/error";

export abstract class CustomErrorBase<
  Code extends string,
  Params extends ErrorParams,
> extends Error {
  protected abstract kind: ErrorKind;

  constructor(
    public code: Code,
    public params: Params,
  ) {
    super(code);
    this.name = "PixelScalerError";
  }

  public toObject(): CustomErrorObject {
    return { code: `error.${this.code}`, params: this.params, kind: this.kind };
  }
}
