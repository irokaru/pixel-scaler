import { CustomErrorBase } from "./_ErrorBase";

type InputErrorCode =
  | "invalid-image-type"
  | "encoding-error"
  | "file-not-found"
  | "canvas-is-unsupported"
  | "invalid-image-size";
type InputErrorParam = Record<InputErrorCode, Record<string, string>>;
interface InputErrorParams extends InputErrorParam {
  "invalid-image-type": { filename: string };
  "encoding-error": { filename: string };
  "file-not-found": { filename: string };
  "canvas-is-unsupported": { filename: string };
  "invalid-image-size": { filename: string };
}

export class InputError<
  C extends InputErrorCode = InputErrorCode,
> extends CustomErrorBase<C, InputErrorParams[C], "input"> {
  readonly kind = "input" as const;

  constructor(code: C, params: InputErrorParams[C]) {
    super(code, params);
    this.name = "PixelScalerInputError";
  }
}
