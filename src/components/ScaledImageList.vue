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
  <div class="scaled-image-list">
    <VFormRadio
      name="displayStyle"
      class="margin-b-1"
      v-model="displayStyle"
      :options="ResultDisplayStyleOptions"
      :enable-i18n="true"
    />
    <div
      class="scaled-image-list__items"
      :class="`scaled-image-list__items--${displayStyle}`"
    >
      <component
        v-for="(scaledImage, index) in modelValue"
        :key="index"
        :scaledImage="scaledImage"
        :is="componentMap[displayStyle]"
        @delete="onClickDeleteOne(index)"
        @download="onClickDownloadOne(index)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>

<style lang="scss" scoped>
@use "../assets/variables.scss";

.scaled-image-list {
  height: 40vh;
  overflow-y: scroll;
  // NOTE: for hidden checkbox box-shadow
  padding: 0 1rem;
  padding-bottom: 1rem;
  margin: 0 -1rem;
  padding-right: 0.3rem;
  margin-right: -0.633rem;

  &::-webkit-scrollbar {
    width: 0.333rem;
  }

  &__items {
    display: grid;
    position: relative;
    gap: 1rem;

    &--grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    &--list {
      grid-template-columns: 1fr;
    }
  }

  @media (max-height: variables.$tablet-height) {
    height: 60vh;
  }
}
</style>
