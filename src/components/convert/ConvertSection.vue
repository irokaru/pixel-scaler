<script setup lang="ts">
import { ImageCheckList } from "@/@types/convert";
import useGlobalError from "@/composables/useGlobalError";
import { useConvertStore } from "@/stores/convertStore";

import InputFileList from "./InputFileList/index.vue";
import ScaledImageList from "./ScaledImageList/index.vue";

const { deleteOneError } = useGlobalError();
const convertStore = useConvertStore();
const { convertAnyChecked, convertOneByUuid } = convertStore;

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
