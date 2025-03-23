type FileErrorCode = "duplicate-file" | "file-not-found";
type FileErrorParam = Record<FileErrorCode, Record<string, string>>;
interface FileErrorParams extends FileErrorParam {
  "duplicate-file": { filename: string };
  "file-not-found": { filename: string };
}

export class FileError extends Error {
  constructor(
    public code: FileErrorCode,
    public params: FileErrorParams[FileErrorCode],
  ) {
    super(code);
    this.name = "PixelScalerFileError";
  }
}
