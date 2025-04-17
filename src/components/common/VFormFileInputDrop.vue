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
