import { ErrorKind } from "@/@types/error";

import { CustomErrorBase } from "./_ErrorBase";

type InputErrorCode =
  | "invalid-image-type"
  | "encoding-error"
  | "file-not-found"
  | "canvas-is-unsupported";
type InputErrorParam = Record<InputErrorCode, Record<string, string>>;
interface InputErrorParams extends InputErrorParam {
  "invalid-image-type": { filename: string };
  "encoding-error": { filename: string };
  "file-not-found": { filename: string };
  "canvas-is-unsupported": { filename: string };
}

export class InputError<
  C extends InputErrorCode = InputErrorCode,
> extends CustomErrorBase<C, InputErrorParams[C]> {
  protected kind: ErrorKind = "input" as const;

  constructor(code: C, params: InputErrorParams[C]) {
    super(code, params);
    this.name = "PixelScalerInputError";
  }
}
