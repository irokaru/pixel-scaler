<script lang="ts" setup>
type Props = {
  acceptedTypes: MIMEType[];
  pickerOpts: FilePickerOptions;
};

type Emits = {
  (e: "fileChange", values: File[]): void;
  (e: "unacceptedFiles", value: File[]): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const hasFileSystemAccess = () =>
  "showOpenFilePicker" in window && Boolean(window.showOpenFilePicker);
const isAcceptable = (file: File) =>
  props.acceptedTypes.includes(file.type as MIMEType);

const handleClicked = async (e: MouseEvent) => {
  if (!hasFileSystemAccess()) return;

  e.preventDefault();

  // NOTE: returns FileSystemFileHandle[] if props.pickerOpts.multiple is true
  const fileHandles = await window.showOpenFilePicker(props.pickerOpts);

  const files = await Promise.all(
    fileHandles.map((fileHandle) => fileHandle.getFile()),
  );
  emits(
    "fileChange",
    files.filter((file) => isAcceptable(file)),
  );
  emits(
    "unacceptedFiles",
    files.filter((file) => !isAcceptable(file)),
  );
};

// NOTE: For browsers with File System Access API (chrome, edge)
const handleDropped = async (e: DragEvent) => {
  if (!hasFileSystemAccess()) return handleChanged(e);

  e.preventDefault();

  const files: File[] = [];
  const unacceptedFiles: File[] = [];

  const items = e.dataTransfer?.items ?? [];

  for (const item of items) {
    if (item.kind !== "file") continue;

    const file = item.getAsFile();

    if (file)
      isAcceptable(file) ? files.push(file) : unacceptedFiles.push(file);
  }

  emits("fileChange", files);
  emits("unacceptedFiles", unacceptedFiles);
};

// NOTE: For browsers without the File System Access API (Firefox, webkit)
const handleChanged = (e: Event) => {
  if (hasFileSystemAccess()) return;

  const files = [...((e.target as HTMLInputElement)?.files ?? [])];

  emits(
    "fileChange",
    files.filter((file) => isAcceptable(file)),
  );
  emits(
    "unacceptedFiles",
    files.filter((file) => !isAcceptable(file)),
  );
};
</script>

<template>
  <label
    class="box circle hover active pointer flex-grow-1"
    @dragover.prevent
    @drop.prevent="handleDropped"
  >
    <input
      type="file"
      :accept="props.acceptedTypes.join(',')"
      multiple
      @click="handleClicked"
      @change="handleChanged"
    />
    <slot></slot>
  </label>
</template>
