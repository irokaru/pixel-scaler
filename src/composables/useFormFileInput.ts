const isAcceptable = (file: File, acceptedTypes: MIMEType[]) =>
  acceptedTypes.includes(file.type as MIMEType);

const useFormFileInput = (options: {
  acceptedTypes: MIMEType[];
  pickerOpts: FilePickerOptions;
}) => {
  const { acceptedTypes, pickerOpts } = options;

  const hasFileSystemAccess = () =>
    import.meta.env.MODE !== "e2e" &&
    "showOpenFilePicker" in globalThis &&
    Boolean(globalThis.showOpenFilePicker);

  const getFilesFromFilePicker = async () => {
    // NOTE: returns FileSystemFileHandle[] if props.pickerOpts.multiple is true and FileHandle if false
    let fileHandles: FileSystemFileHandle[];
    try {
      fileHandles = await showOpenFilePicker(pickerOpts);
    } catch {
      fileHandles = [];
    }

    const allFiles = await Promise.all(
      fileHandles.map((fileHandle) => fileHandle.getFile()),
    );

    const files = allFiles.filter((file) => isAcceptable(file, acceptedTypes));
    const unacceptedFiles = allFiles.filter(
      (file) => !isAcceptable(file, acceptedTypes),
    );

    return { files, unacceptedFiles };
  };

  const getFilesFromEvent = (event_: Event) => {
    const allFiles = [...((event_.target as HTMLInputElement)?.files ?? [])];

    const files = allFiles.filter((file) => isAcceptable(file, acceptedTypes));
    const unacceptedFiles = allFiles.filter(
      (file) => !isAcceptable(file, acceptedTypes),
    );

    return { files, unacceptedFiles };
  };

  const getFilesFromDragEvent = (dragEvent: DragEvent) => {
    const files: File[] = [];
    const unacceptedFiles: File[] = [];

    const items = dragEvent.dataTransfer?.items ?? [];

    for (const item of items) {
      if (item.kind !== "file") continue;

      const file = item.getAsFile();

      if (!file) continue;

      if (isAcceptable(file, acceptedTypes)) {
        files.push(file);
      } else {
        unacceptedFiles.push(file);
      }
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
