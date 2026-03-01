export type ErrorParams = Record<string, string | number>;
export type ErrorKind = "file" | "scale" | "input" | "unknown";

export type CustomErrorObject<K extends ErrorKind = ErrorKind> = {
  uuid: string;
  code: string;
  params: ErrorParams;
  kind: K;
};
