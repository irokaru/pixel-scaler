<script setup lang="ts">
import { ref } from "vue";

import useFormFileInput from "@/composables/useFormFileInput";

type Props = {
  acceptedTypes: MIMEType[];
  pickerOpts: FilePickerOptions;
};

type Emits = {
  fileChange: [files: File[]];
  unacceptedFiles: [files: File[]];
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const { hasFileSystemAccess, getFilesFromFilePicker, getFilesFromEvent } =
  useFormFileInput(props);

const inputRef = ref<HTMLInputElement | null>(null);

const resetInputValue = () => {
  if (inputRef.value) inputRef.value.value = "";
};

const handleClicked = async (e: MouseEvent) => {
  if (!hasFileSystemAccess()) return;
  e.preventDefault();

  const { files, unacceptedFiles } = await getFilesFromFilePicker();

  emits("fileChange", files);
  emits("unacceptedFiles", unacceptedFiles);

  resetInputValue();
};

// NOTE: For browsers without the File System Access API (Firefox, webkit)
const handleChanged = (e: Event) => {
  if (hasFileSystemAccess()) return;
  e.preventDefault();

  const { files, unacceptedFiles } = getFilesFromEvent(e);

  emits("fileChange", files);
  emits("unacceptedFiles", unacceptedFiles);

  resetInputValue();
};
</script>

<template>
  <label>
    <input
      ref="inputRef"
      type="file"
      :accept="acceptedTypes.join(',')"
      multiple
      @click="handleClicked"
      @change="handleChanged"
    />
    <slot></slot>
  </label>
</template>
