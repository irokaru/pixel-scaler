import { PSCustomErrorKind } from "@/@types/error";

import { PSCustomError } from "./_ErrorBase";

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

export class InputError extends PSCustomError {
  protected kind: PSCustomErrorKind = "input";

  constructor(
    public code: InputErrorCode,
    public params: InputErrorParams[InputErrorCode],
  ) {
    super(code, params);
    this.name = "PixelScalerInputError";
  }
}
