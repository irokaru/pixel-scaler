<script lang="ts" setup>
import { ref, watch } from "vue";

import { ImageEntry } from "@/@types/convert";

import InputFileListItem from "./InputFileListItem.vue";
import InputFileListItemHeader from "./InputFileListItemHeader.vue";

const modelValue = defineModel<ImageEntry[]>({ required: true, default: [] });
const allChecked = ref<boolean>(false);
const emit = defineEmits<{
  convert: [value: number];
  delete: [value: number];
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
      v-if="modelValue.length > 0"
      @click="toggleAllChecked"
    />
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
