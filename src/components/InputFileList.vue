<script lang="ts" setup>
import { ref, watch } from "vue";

import { ImageEntry } from "@/@types/convert";

import InputFileListItem from "./InputFileListItem.vue";
import InputFileListItemHeader from "./InputFileListItemHeader.vue";

const modelValue = defineModel<ImageEntry[]>({ required: true, default: [] });
const originalPixelSize = defineModel<number>("originalPixelSize", {
  required: true,
});
const scaleMode = defineModel<string>("scaleMode", { required: true });
const scaleSizePercent = defineModel<number>("scaleSizePercent", {
  required: true,
});

const allChecked = ref<boolean>(false);
const emits = defineEmits<{
  convert: [value: number];
  delete: [value: number];
  apply: [];
}>();

const updateAllChecked = () => {
  allChecked.value = modelValue.value.every((item) => item.settings.checked);
};

const toggleAllChecked = () => {
  for (const item of modelValue.value) {
    item.settings.checked = !allChecked.value;
  }
};

watch(() => modelValue, updateAllChecked, {
  deep: true,
});
</script>

<template>
  <div data-testid="input-file-list">
    <InputFileListItemHeader
      v-model="allChecked"
      v-model:original-pixel-size="originalPixelSize"
      v-model:scale-mode="scaleMode"
      v-model:scale-size-percent="scaleSizePercent"
      @click="toggleAllChecked"
      @apply="emits('apply')"
    />
    <hr />
    <InputFileListItem
      v-for="(_, index) in modelValue"
      :key="index"
      v-model="modelValue[index]"
      :index="index"
      @convert="emits('convert', index)"
      @delete="emits('delete', index)"
    />
  </div>
</template>
