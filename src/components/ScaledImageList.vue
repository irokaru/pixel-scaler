<script lang="ts" setup>
import { ref } from "vue";

import { ScaledImage } from "@/@types/convert";
import { ResultDisplayStyleType } from "@/@types/form";
import { ResultDisplayStyleOptions } from "@/constants/form";

import VFormRadio from "./common/VFormRadio.vue";
import ScaledImageListItemGridView from "./ScaledImageListItemGridView.vue";
import ScaledImageListItemListView from "./ScaledImageListItemListView.vue";

type Props = {
  scaledImages: ScaledImage[];
};
defineProps<Props>();

const displayStyle = ref<ResultDisplayStyleType>("grid");

const componentMap = {
  grid: ScaledImageListItemGridView,
  list: ScaledImageListItemListView,
};
</script>

<template>
  <div class="scaled-image-list">
    <VFormRadio
      name="displayStyle"
      v-model="displayStyle"
      :options="ResultDisplayStyleOptions"
      :enable-i18n="true"
    />
    <component
      v-for="(scaledImage, index) in scaledImages"
      :key="index"
      :scaledImage="scaledImage"
      :is="componentMap[displayStyle]"
    />
  </div>
</template>
