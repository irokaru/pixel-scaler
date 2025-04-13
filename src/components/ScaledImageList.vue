<script lang="ts" setup>
import { ref } from "vue";

import { ScaledImage } from "@/@types/convert";
import { ResultDisplayStyleType } from "@/@types/form";
import { ResultDisplayStyleOptions } from "@/constants/form";

import VFormRadio from "./common/VFormRadio.vue";
import ScaledImageListItemGridView from "./ScaledImageListItemGridView.vue";
import ScaledImageListItemListView from "./ScaledImageListItemListView.vue";

const modelValue = defineModel<ScaledImage[]>({ required: true });

const displayStyle = ref<ResultDisplayStyleType>("grid");

const componentMap = {
  grid: ScaledImageListItemGridView,
  list: ScaledImageListItemListView,
};

const onClickDeleteOne = (index: number) => {
  modelValue.value.splice(index, 1);
};

const onClickDownloadOne = (index: number) => {
  const file = modelValue.value[index].file;
  const link = document.createElement("a");
  link.href = file.url;
  link.download = file.data.name;
  link.click();
};
</script>

<template>
  <div class="scaled-image-list box-reverse block margin-tb-2">
    <VFormRadio
      name="displayStyle"
      class="margin-b-1"
      v-model="displayStyle"
      :options="ResultDisplayStyleOptions"
      :enable-i18n="true"
    />
    <component
      v-for="(scaledImage, index) in modelValue"
      :key="index"
      :scaledImage="scaledImage"
      :is="componentMap[displayStyle]"
      @delete="onClickDeleteOne(index)"
      @download="onClickDownloadOne(index)"
    />
  </div>
</template>

<style scoped lang="scss"></style>
