<script setup lang="ts">
import { ref } from "vue";

import { ImageCheckList, ImageEntry } from "@/@types/convert";
import { CustomErrorObject } from "@/@types/error";
import useImageConvert from "@/composables/useImageConvert";

import InputFileList from "./InputFileList/index.vue";
import ScaledImageList from "./ScaledImageList/index.vue";

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
    />
    <ScaledImageList v-model="scaledImageList" v-model:errors="errors" />
  </section>
</template>
