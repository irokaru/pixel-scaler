<script setup lang="ts">
import useFormFileInput from "@/composables/useFormFileInput";

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
const { hasFileSystemAccess, getFilesFromFilePicker, getFilesFromEvent } =
  useFormFileInput(props);

const handleClicked = async (e: MouseEvent) => {
  if (!hasFileSystemAccess()) return;
  e.preventDefault();

  const { files, unacceptedFiles } = await getFilesFromFilePicker();

  emits("fileChange", files);
  emits("unacceptedFiles", unacceptedFiles);
};

// NOTE: For browsers without the File System Access API (Firefox, webkit)
const handleChanged = (e: Event) => {
  if (hasFileSystemAccess()) return;
  e.preventDefault();

  const { files, unacceptedFiles } = getFilesFromEvent(e);

  emits("fileChange", files);
  emits("unacceptedFiles", unacceptedFiles);
};
</script>

<template>
  <label>
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
