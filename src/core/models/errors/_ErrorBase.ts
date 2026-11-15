import { v4 as uuidv4 } from "uuid";

import type {
  ErrorKind,
  CustomErrorObject,
  ErrorParameters,
} from "@/types/error";
export abstract class CustomErrorBase<
  Code extends string,
  Parameters_ extends ErrorParameters,
  Kind extends ErrorKind = ErrorKind,
> extends Error {
  readonly uuid: string;
  abstract readonly kind: Kind;
  code: Code;
  params: Parameters_;

  constructor(code: Code, parameters: Parameters_) {
    super(code);
    this.name = "PixelScalerError";
    this.uuid = uuidv4();
    this.code = code;
    this.params = parameters;
  }

  public toObject(): CustomErrorObject<Kind> {
    return {
      uuid: this.uuid,
      code: `error.${this.kind}.${this.code}`,
      params: this.params,
      kind: this.kind,
    };
  }
}
