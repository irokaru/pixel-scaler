<script lang="ts" setup>
import useFormFileInput from "@/composables/useFormFileInput";
import { InputImageData } from "@/models/InputImageData";

type Props = {
  acceptedTypes: MIMEType[];
  pickerOpts: FilePickerOptions;
};

type Emits = {
  (e: "fileChange", values: InputImageData[]): void;
  (e: "unacceptedFiles", value: File[]): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const { getFilesFromDragEvent } = useFormFileInput(props);

const handleDropped = async (e: DragEvent) => {
  const { files, unacceptedFiles } = getFilesFromDragEvent(e);
  const inputImageDataList: InputImageData[] = [];

  Promise.allSettled(
    files.map(async (file) => {
      try {
        inputImageDataList.push(await InputImageData.init(file));
      } catch {
        unacceptedFiles.push(file);
      }
    }),
  );

  emits("fileChange", inputImageDataList);
  emits("unacceptedFiles", unacceptedFiles);
};
</script>

<template>
  <div @drop.prevent="handleDropped" @dragover.prevent>
    <slot></slot>
  </div>
</template>
