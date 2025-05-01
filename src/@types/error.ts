export type PSCustomErrorKind = "file" | "scale" | "input" | "unknown";

export type PSCustomErrorObject = {
  key: string;
  params: Record<string, string | number>;
  kind: PSCustomErrorKind;
};
