import { CustomErrorBase } from "./_ErrorBase";

type FileErrorCode = "duplicate-image";
type FileErrorParameter = Record<FileErrorCode, Record<string, string>>;
interface FileErrorParameters extends FileErrorParameter {
  "duplicate-image": { filename: string };
}

export class FileError<
  C extends FileErrorCode = FileErrorCode,
> extends CustomErrorBase<FileErrorCode, FileErrorParameters[C], "file"> {
  readonly kind = "file" as const;

  constructor(code: C, parameters: FileErrorParameters[C]) {
    super(code, parameters);
    this.name = "PixelScalerFileError";
  }
}
