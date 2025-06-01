<script setup lang="ts">
import { ref } from "vue";

import { ImageCheckList, ImageEntry } from "@/@types/convert";
import useGlobalError from "@/composables/useGlobalError";
import useImageConvert from "@/composables/useImageConvert";

import InputFileList from "./InputFileList/index.vue";
import ScaledImageList from "./ScaledImageList/index.vue";

const { GlobalErrors, deleteOneError } = useGlobalError();
const imageEntryList = ref<ImageEntry[]>([]);
const scaledImageList = ref<ImageEntry[]>([]);

const { convertAnyChecked, convertOneByUuid } = useImageConvert(
  imageEntryList,
  scaledImageList,
  GlobalErrors,
);

const onConvertAll = async (checked: ImageCheckList) => {
  await convertAnyChecked(checked);
};
const onConvertOne = async (uuid: string) => {
  await convertOneByUuid(uuid);
};
</script>

<template>
  <section>
    <InputFileList
      v-model="imageEntryList"
      v-model:errors="GlobalErrors"
      @convert-all="onConvertAll"
      @convert-one="onConvertOne"
      @delete-one-error="deleteOneError"
    />
    <ScaledImageList v-model="scaledImageList" />
  </section>
</template>
