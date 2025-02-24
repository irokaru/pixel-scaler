<script lang="ts" setup>
import { ImageEntry } from "@/@types/convert";

import InputFileListItem from "./InputFileListItem.vue";

const modelValue = defineModel<ImageEntry[]>({ required: true, default: [] });
const emit = defineEmits<{
  convert: [value: number];
  delete: [value: number];
}>();
</script>

<template>
  <div data-testid="input-file-list">
    <InputFileListItem
      v-for="(_, index) in modelValue"
      :key="index"
      v-model="modelValue[index]"
      :index="index"
      @convert="emit('convert', index)"
      @delete="emit('delete', index)"
    />
  </div>
</template>
