import { v4 as uuidv4 } from "uuid";

import { ErrorKind, CustomErrorObject, ErrorParams } from "@/@types/error";
export abstract class CustomErrorBase<
  Code extends string,
  Params extends ErrorParams,
> extends Error {
  protected uuid: string;
  protected abstract kind: ErrorKind;

  constructor(
    public code: Code,
    public params: Params,
  ) {
    super(code);
    this.name = "PixelScalerError";
    this.uuid = uuidv4();
  }

  public toObject(): CustomErrorObject {
    return {
      uuid: this.uuid,
      code: `error.${this.kind}.${this.code}`,
      params: this.params,
      kind: this.kind,
    };
  }
}
