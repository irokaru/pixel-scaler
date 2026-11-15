import { CustomErrorBase } from "./_ErrorBase";

type InputErrorCode =
  | "invalid-image-type"
  | "encoding-error"
  | "file-not-found"
  | "canvas-is-unsupported"
  | "invalid-image-size";
type InputErrorParameter = Record<InputErrorCode, Record<string, string>>;
interface InputErrorParameters extends InputErrorParameter {
  "invalid-image-type": { filename: string };
  "encoding-error": { filename: string };
  "file-not-found": { filename: string };
  "canvas-is-unsupported": { filename: string };
  "invalid-image-size": { filename: string };
}

export class InputError<
  C extends InputErrorCode = InputErrorCode,
> extends CustomErrorBase<C, InputErrorParameters[C], "input"> {
  readonly kind = "input" as const;

  constructor(code: C, parameters: InputErrorParameters[C]) {
    super(code, parameters);
    this.name = "PixelScalerInputError";
  }
}
