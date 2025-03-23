const isAcceptable = (file: File, acceptedTypes: MIMEType[]) =>
  acceptedTypes.includes(file.type as MIMEType);

const useFormFileInput = (opts: {
  acceptedTypes: MIMEType[];
  pickerOpts: FilePickerOptions;
}) => {
  const { acceptedTypes, pickerOpts } = opts;

  const hasFileSystemAccess = () =>
    "showOpenFilePicker" in globalThis &&
    Boolean(globalThis.showOpenFilePicker);

  const getFilesFromFilePicker = async () => {
    // NOTE: returns FileSystemFileHandle[] if props.pickerOpts.multiple is true and FileHandle if false
    const fileHandles = await globalThis
      .showOpenFilePicker(pickerOpts)
      .catch(() => []);

    const allFiles = await Promise.all(
      fileHandles.map((fileHandle) => fileHandle.getFile()),
    );

    const files = allFiles.filter((file) => isAcceptable(file, acceptedTypes));
    const unacceptedFiles = allFiles.filter(
      (file) => !isAcceptable(file, acceptedTypes),
    );

    return { files, unacceptedFiles };
  };

  const getFilesFromEvent = (e: Event) => {
    const allFiles = [...((e.target as HTMLInputElement)?.files ?? [])];

    const files = allFiles.filter((file) => isAcceptable(file, acceptedTypes));
    const unacceptedFiles = allFiles.filter(
      (file) => !isAcceptable(file, acceptedTypes),
    );

    return { files, unacceptedFiles };
  };

  const getFilesFromDragEvent = (e: DragEvent) => {
    const files: File[] = [];
    const unacceptedFiles: File[] = [];

    const items = e.dataTransfer?.items ?? [];

    for (const item of items) {
      if (item.kind !== "file") continue;

      const file = item.getAsFile();

      if (!file) continue;

      isAcceptable(file, acceptedTypes)
        ? files.push(file)
        : unacceptedFiles.push(file);
    }

    return { files, unacceptedFiles };
  };

  return {
    hasFileSystemAccess,
    getFilesFromFilePicker,
    getFilesFromEvent,
    getFilesFromDragEvent,
  };
};

export default useFormFileInput;
