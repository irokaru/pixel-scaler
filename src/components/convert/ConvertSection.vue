<script setup lang="ts">
import { ref } from "vue";

import { ImageCheckList, ImageEntry, ScaledImage } from "@/@types/convert";
import useImageConvert from "@/composables/useImageConvert";

import InputFileList from "./InputFileList/index.vue";
import ScaledImageList from "./ScaledImageList/index.vue";

const imageEntryList = ref<ImageEntry[]>([]);
const scaledImageList = ref<ScaledImage[]>([]);

const { convertAll, convertOne } = useImageConvert(
  imageEntryList,
  scaledImageList,
);

const onConvertAll = async (checked: ImageCheckList) => {
  await convertAll(checked);
};
const onConvertOne = async (index: number) => {
  await convertOne(index);
};
</script>

<template>
  <section>
    <InputFileList
      v-model:image-entry-list="imageEntryList"
      @convert-all="onConvertAll"
      @convert-one="onConvertOne"
    />
    <ScaledImageList v-model="scaledImageList" />
  </section>
</template>
