<script lang="ts" setup>
import { ImageEntry } from "@/@types/convert";

import InputFileListItem from "./InputFileListItem.vue";

const modelValue = defineModel<ImageEntry[]>({ required: true, default: [] });
</script>

<template>
  <div data-testid="input-file-list">
    <InputFileListItem
      v-for="(_, index) in modelValue"
      :key="index"
      v-model="modelValue[index].image"
      :index="index"
    />
  </div>
</template>
