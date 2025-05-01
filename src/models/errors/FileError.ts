import { PSCustomErrorKind } from "@/@types/error";

import { PSCustomError } from "./_ErrorBase";

type FileErrorCode = "duplicate-image";
type FileErrorParam = Record<FileErrorCode, Record<string, string>>;
interface FileErrorParams extends FileErrorParam {
  "duplicate-image": { filename: string };
}

export class FileError extends PSCustomError {
  protected kind: PSCustomErrorKind = "file";

  constructor(
    public code: FileErrorCode,
    public params: FileErrorParams[FileErrorCode],
  ) {
    super(code, params);
    this.name = "PixelScalerFileError";
  }
}
