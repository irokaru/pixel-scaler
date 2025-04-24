<script setup lang="ts">
import { ref } from "vue";

import { ScaledImage } from "@/@types/convert";
import { ResultDisplayStyleType } from "@/@types/form";
import useImageCheckable from "@/composables/useImageCheckable";
import useScaledImageList from "@/composables/useScaledImageList";

import Header from "./Header.vue";
import ScaledImageListItemGridView from "./ItemGridView.vue";
import ScaledImageListItemListView from "./ItemListView.vue";

const modelValue = defineModel<ScaledImage[]>({ required: true, default: [] });
const { checkedMap, isAnyChecked } = useImageCheckable(modelValue);
const {
  downloadOne,
  downloadAnyChecked,
  downloadAnyCheckedZip,
  deleteOne,
  deleteAnyChecked,
} = useScaledImageList(modelValue);
const displayStyle = ref<ResultDisplayStyleType>("grid");

const componentMap = {
  grid: ScaledImageListItemGridView,
  list: ScaledImageListItemListView,
};

const onClickDownloadOne = (index: number) => {
  downloadOne(index);
};

const onClickDownloadAnyChecked = () => {
  downloadAnyChecked(checkedMap.value);
};

const onClickDownloadAnyCheckedZip = async () => {
  downloadAnyCheckedZip(checkedMap.value);
};

const onClickDeleteChecked = () => {
  deleteAnyChecked(checkedMap.value);
};

const onClickDeleteOne = (index: number) => {
  deleteOne(index);
};
</script>

<template>
  <div
    class="scaled-image-list box-reverse block margin-tb-2"
    v-if="modelValue.length > 0"
  >
    <Header
      v-model:displayStyle="displayStyle"
      :isAnyChecked="isAnyChecked"
      :onClickDownloadAll="onClickDownloadAnyChecked"
      :onClickDownloadZip="onClickDownloadAnyCheckedZip"
      :onClickDeleteAll="onClickDeleteChecked"
    />
    <hr />
    <div
      class="scaled-image-list__items"
      :class="`scaled-image-list__items--${displayStyle}`"
    >
      <component
        v-for="(scaledImage, index) in modelValue"
        :key="index"
        :scaledImage="scaledImage"
        v-model:checked="checkedMap[scaledImage.image.uuid]"
        :is="componentMap[displayStyle]"
        @delete="onClickDeleteOne(index)"
        @download="onClickDownloadOne(index)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../assets/variables.scss";

.scaled-image-list {
  &__items {
    height: 40vh;
    overflow-y: scroll;
    // NOTE: for hidden checkbox box-shadow
    padding: 0 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    margin: 0 -1rem;
    padding-right: 0.3rem;
    margin-right: -0.633rem;
    position: relative;
    gap: 1rem;

    &--grid {
      display: grid;
      align-items: start;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    &--list {
      display: flex;
      flex-direction: column;
    }

    &::-webkit-scrollbar {
      width: 0.333rem;
    }

    @media (max-height: variables.$tablet-height) {
      height: 60vh;
    }
  }
}
</style>
