<script setup lang="ts">
import { ref } from "vue";

import useFormFileInput from "@/composables/useFormFileInput";

type Properties = {
  acceptedTypes: MIMEType[];
  pickerOpts: FilePickerOptions;
};

type Emits = {
  fileChange: [files: File[]];
  unacceptedFiles: [files: File[]];
};

const properties = defineProps<Properties>();
const emits = defineEmits<Emits>();
const { hasFileSystemAccess, getFilesFromFilePicker, getFilesFromEvent } =
  useFormFileInput(properties);

const inputReference = ref<HTMLInputElement | null>(null);

const resetInputValue = () => {
  if (inputReference.value) inputReference.value.value = "";
};

const handleClicked = async (mouseEvent: MouseEvent) => {
  if (!hasFileSystemAccess()) return;
  mouseEvent.preventDefault();

  const { files, unacceptedFiles } = await getFilesFromFilePicker();

  emits("fileChange", files);
  emits("unacceptedFiles", unacceptedFiles);

  resetInputValue();
};

// NOTE: For browsers without the File System Access API (Firefox, webkit)
const handleChanged = (changeEvent: Event) => {
  if (hasFileSystemAccess()) return;
  changeEvent.preventDefault();

  const { files, unacceptedFiles } = getFilesFromEvent(changeEvent);

  emits("fileChange", files);
  emits("unacceptedFiles", unacceptedFiles);

  resetInputValue();
};
</script>

<template>
  <label>
    <input
      ref="inputReference"
      type="file"
      :accept="acceptedTypes.join(',')"
      multiple
      @click="handleClicked"
      @change="handleChanged"
    />
    <slot></slot>
  </label>
</template>
