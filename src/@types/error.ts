export type ErrorKind = "file" | "scale" | "input" | "unknown";

export type CustomErrorObject = {
  code: string;
  params: Record<string, string | number>;
  kind: ErrorKind;
};
