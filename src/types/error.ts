export type ErrorParameters = Record<string, string | number>;
export type ErrorKind = "file" | "scale" | "input" | "unknown";

export type CustomErrorObject<K extends ErrorKind = ErrorKind> = {
  uuid: string;
  code: string;
  params: ErrorParameters;
  kind: K;
};
