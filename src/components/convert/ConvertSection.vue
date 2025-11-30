<script setup lang="ts">
import { storeToRefs } from "pinia";

import { ImageCheckList } from "@/@types/convert";
import useGlobalError from "@/composables/useGlobalError";
import useImageConvert from "@/composables/useImageConvert";
import useImageEntryStore from "@/stores/imageEntryStore";

import InputFileList from "./InputFileList/index.vue";
import ScaledImageList from "./ScaledImageList/index.vue";

const store = useImageEntryStore();
const { imageEntryList, scaledImageList } = storeToRefs(store);

const { GlobalErrors, deleteOneError } = useGlobalError();
const { convertAnyChecked, convertOneByUuid } = useImageConvert();

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
      @convert-all="onConvertAll"
      @convert-one="onConvertOne"
      @delete-one-error="deleteOneError"
    />
    <ScaledImageList />
  </section>
</template>
