<script setup lang="ts">
import { ref } from "vue";

import { ImageCheckList, ImageEntry } from "@/@types/convert";
import { CustomErrorObject } from "@/@types/error";
import useImageConvert from "@/composables/useImageConvert";

import InputFileList from "./InputFileList/index.vue";
import ScaledImageList from "./ScaledImageList/index.vue";

type Emits = {
  deleteOneError: [uuid: string];
};

defineEmits<Emits>();

const imageEntryList = ref<ImageEntry[]>([]);
const scaledImageList = ref<ImageEntry[]>([]);
const errors = defineModel<CustomErrorObject[]>("errors", { required: true });

const { convertAnyChecked, convertOne } = useImageConvert(
  imageEntryList,
  scaledImageList,
  errors,
);

const onConvertAll = async (checked: ImageCheckList) => {
  await convertAnyChecked(checked);
};
const onConvertOne = async (entry: ImageEntry) => {
  await convertOne(entry);
};
</script>

<template>
  <section>
    <InputFileList
      v-model="imageEntryList"
      v-model:errors="errors"
      @convert-all="onConvertAll"
      @convert-one="onConvertOne"
      @delete-one-error="$emit('deleteOneError', $event)"
    />
    <ScaledImageList v-model="scaledImageList" />
  </section>
</template>
