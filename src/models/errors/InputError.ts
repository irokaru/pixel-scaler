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

export class InputError extends CustomErrorBase {
  protected kind: ErrorKind = "input";

  constructor(
    public code: InputErrorCode,
    public params: InputErrorParams[InputErrorCode],
  ) {
    super(code, params);
    this.name = "PixelScalerInputError";
  }
}
