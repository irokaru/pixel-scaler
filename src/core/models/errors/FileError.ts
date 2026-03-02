import { CustomErrorBase } from "./_ErrorBase";

type FileErrorCode = "duplicate-image";
type FileErrorParam = Record<FileErrorCode, Record<string, string>>;
interface FileErrorParams extends FileErrorParam {
  "duplicate-image": { filename: string };
}

export class FileError<
  C extends FileErrorCode = FileErrorCode,
> extends CustomErrorBase<FileErrorCode, FileErrorParams[C], "file"> {
  readonly kind = "file" as const;

  constructor(
    public code: C,
    public params: FileErrorParams[C],
  ) {
    super(code, params);
    this.name = "PixelScalerFileError";
  }
}
