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
const { hasFileSystemAccess, getFilesFromFilePicker, getFilesFromEvent } =
  useFormFileInput(props);

const handleClicked = async (e: MouseEvent) => {
  if (!hasFileSystemAccess()) return;
  e.preventDefault();

  const { files, unacceptedFiles } = await getFilesFromFilePicker();

  const inputImageDataList: InputImageData[] = [];

  await Promise.all(
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

// NOTE: For browsers without the File System Access API (Firefox, webkit)
const handleChanged = (e: Event) => {
  if (hasFileSystemAccess()) return;
  e.preventDefault();

  const { files, unacceptedFiles } = getFilesFromEvent(e);
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
