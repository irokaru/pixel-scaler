<script lang="ts" setup>
import { ref } from "vue";

import { ScaledImage } from "@/@types/convert";
import { ResultDisplayStyleType } from "@/@types/form";
import { ResultDisplayStyleOptions } from "@/constants/form";

import VFormButton from "./common/VFormButton.vue";
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

const onClickDownloadAll = () => {
  for (const index of modelValue.value.keys()) {
    onClickDownloadOne(index);
  }
};

const onClickDownloadZip = () => {};

const onClickDeleteAll = () => {
  modelValue.value = [];
};
</script>

<template>
  <div class="scaled-image-list">
    <div class="scaled-image-list__ctrl padding-tb-1">
      <div class="scaled-image-list__ctrl__display">
        <VFormRadio
          name="displayStyle"
          v-model="displayStyle"
          :options="ResultDisplayStyleOptions"
          :enable-i18n="true"
        />
      </div>
      <div class="scaled-image-list__ctrl__buttons">
        <VFormButton class="circle" @click="onClickDownloadZip">
          {{ $t("convert.download-zip") }}
        </VFormButton>
        <VFormButton class="circle" @click="onClickDeleteAll">
          {{ $t("delete-all") }}
        </VFormButton>
      </div>
    </div>
    <hr />
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
  & .scaled-image-list__ctrl {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__display {
      flex-grow: 1;
    }

    &__buttons {
      display: flex;
      gap: 0 1rem;
    }
  }

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
    display: grid;
    position: relative;
    gap: 1rem;

    &--grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    &--list {
      grid-template-columns: 1fr;
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
