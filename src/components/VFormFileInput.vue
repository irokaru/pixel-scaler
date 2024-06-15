<script lang="ts" setup>
type Props = {
  acceptTypes: MIMEType[];
  pickerOpts: FilePickerOptions;
};

type Emits = {
  (e: "fileChange", values: File[]): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const hasFileSystemAccess = !("showOpenFilePicker" in window);

const handleClicked = async (e: MouseEvent) => {
  if (!hasFileSystemAccess) return;

  e.preventDefault();

  const fileHandles = await window.showOpenFilePicker(props.pickerOpts);
  const files = await Promise.all(
    fileHandles.map((fileHandle) => fileHandle.getFile()),
  );
  emits("fileChange", files);
};

// NOTE: For browsers with File System Access API (chrome, edge)
const handleDropped = async (e: DragEvent) => {
  if (!hasFileSystemAccess) return handleChanged(e);

  e.preventDefault();

  const files: File[] = [];
  const items = e.dataTransfer?.items ?? [];

  for (const item of items) {
    if (
      item.kind !== "file" ||
      !props.acceptTypes.includes(item.type as MIMEType)
    )
      continue;

    const file = item.getAsFile();

    if (file) files.push(file);
  }

  emits("fileChange", files);
};

// NOTE: For browsers without the File System Access API (Firefox, webkit)
const handleChanged = (e: Event) => {
  if (hasFileSystemAccess) return;

  const files = [...((e.target as HTMLInputElement)?.files ?? [])];

  emits(
    "fileChange",
    files.filter((file) => props.acceptTypes.includes(file.type as MIMEType)),
  );
};
</script>

<template>
  <label
    class="box circle hover active pointer flex-grow-1 margin-tb-1"
    @dragover.prevent
    @drop.prevent="handleDropped"
  >
    <input
      type="file"
      :accept="props.acceptTypes.join(',')"
      multiple
      @click="handleClicked"
      @change="handleChanged"
    />
    <slot></slot>
  </label>
</template>
