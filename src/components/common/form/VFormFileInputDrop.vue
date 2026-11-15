<script setup lang="ts">
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
const { getFilesFromDragEvent } = useFormFileInput(properties);

const handleDropped = async (dragEvent: DragEvent) => {
  const { files, unacceptedFiles } = getFilesFromDragEvent(dragEvent);

  emits("fileChange", files);
  emits("unacceptedFiles", unacceptedFiles);
};
</script>

<template>
  <div @drop.prevent="handleDropped" @dragover.prevent>
    <slot></slot>
  </div>
</template>
