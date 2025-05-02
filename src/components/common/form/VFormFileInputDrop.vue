<script setup lang="ts">
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
const { getFilesFromDragEvent } = useFormFileInput(props);

const handleDropped = async (e: DragEvent) => {
  const { files, unacceptedFiles } = getFilesFromDragEvent(e);

  emits("fileChange", files);
  emits("unacceptedFiles", unacceptedFiles);
};
</script>

<template>
  <div @drop.prevent="handleDropped" @dragover.prevent>
    <slot></slot>
  </div>
</template>
