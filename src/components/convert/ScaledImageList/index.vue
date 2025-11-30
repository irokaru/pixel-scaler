<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import useDisplayStyle from "@/composables/useDisplayStyle";
import useImageCheckable from "@/composables/useImageCheckable";
import useImageEntryCheckedOperation from "@/composables/useImageEntryCheckedOperation";
import useImageEntryList from "@/composables/useImageEntryList";
import useImageEntryStore from "@/stores/imageEntryStore";
import useOutputPathStore from "@/stores/outputPathStore";

import Header from "./Header.vue";
import ScaledImageListItemGridView from "./ItemGridView.vue";
import ScaledImageListItemListView from "./ItemListView.vue";

const imageEntryStore = useImageEntryStore();
const { scaledImageList } = storeToRefs(imageEntryStore);

const outputPathStore = useOutputPathStore();
const { outputPath, hasError } = storeToRefs(outputPathStore);

const { checkedMap, isAnyChecked, allChecked, toggleAllChecked } =
  useImageCheckable(scaledImageList);
const { downloadOne, deleteOne, isImageEntryListEmpty } = useImageEntryList(
  scaledImageList,
  undefined,
  outputPath,
);
const { downloadAnyChecked, deleteAnyChecked, downloadAnyCheckedZip } =
  useImageEntryCheckedOperation(scaledImageList.value);
const { displayStyle } = useDisplayStyle();

const componentMap = {
  grid: ScaledImageListItemGridView,
  list: ScaledImageListItemListView,
};

const onClickDownloadOne = (uuid: string) => {
  downloadOne(uuid);
};

const onClickDownloadAnyChecked = () => {
  downloadAnyChecked(checkedMap.value, outputPath.value);
};

const onClickDownloadAnyCheckedZip = async () => {
  downloadAnyCheckedZip(checkedMap.value);
};

const onClickDeleteOne = (uuid: string) => {
  deleteOne(uuid);
};

const onClickDeleteChecked = () => {
  scaledImageList.value = deleteAnyChecked(checkedMap.value);
};

const isListEmpty = computed(() => isImageEntryListEmpty());
</script>

<template>
  <div
    class="scaled-image-list box-reverse block margin-tb-2"
    v-if="!isListEmpty"
  >
    <Header
      v-model="allChecked"
      v-model:displayStyle="displayStyle"
      :is-any-checked="isAnyChecked"
      @toggle-all-checked="toggleAllChecked"
      @download-zip="onClickDownloadAnyCheckedZip"
      @download-all="onClickDownloadAnyChecked"
      @delete-all="onClickDeleteChecked"
    />
    <hr />
    <div
      class="scaled-image-list__items"
      :class="`scaled-image-list__items--${displayStyle}`"
    >
      <component
        v-for="scaledImage in scaledImageList"
        :key="scaledImage.image.uuid"
        :scaledImage="scaledImage"
        v-model:checked="checkedMap[scaledImage.image.uuid]"
        :is="componentMap[displayStyle]"
        :has-output-path-error="hasError"
        @delete="onClickDeleteOne(scaledImage.image.uuid)"
        @download="onClickDownloadOne(scaledImage.image.uuid)"
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
