<script lang="ts" setup>
import { ref, watch } from "vue";

import { ScaledImage } from "@/@types/convert";
import { ResultDisplayStyleType } from "@/@types/form";
import VFormButton from "@/components/common/VFormButton.vue";
import VFormRadio from "@/components/common/VFormRadio.vue";
import useImageCheckable from "@/composables/useImageCheckable";
import { ResultDisplayStyleOptions } from "@/constants/form";
import { isWeb } from "@/core/system";
import {
  createZipBlobFromScaledImages,
  downloadBlob,
  downloadString,
} from "@/utils/fileUtils";

import ScaledImageListItemGridView from "./ItemGridView.vue";
import ScaledImageListItemListView from "./ItemListView.vue";

const modelValue = defineModel<ScaledImage[]>({ required: true, default: [] });
const { checkedMap } = useImageCheckable(modelValue);
const displayStyle = ref<ResultDisplayStyleType>("grid");

const componentMap = {
  grid: ScaledImageListItemGridView,
  list: ScaledImageListItemListView,
};

const onClickDeleteOne = (index: number) => {
  modelValue.value.splice(index, 1);
};

const onClickDownloadOne = (index: number) => {
  const image = modelValue.value[index].image;
  downloadString(image.url, image.data.name);
};

const onClickDownloadAll = () => {
  for (const index of modelValue.value.keys()) {
    onClickDownloadOne(index);
  }
};

const onClickDownloadZip = async () => {
  const zipBlob = await createZipBlobFromScaledImages(modelValue.value);
  downloadBlob(zipBlob, "images.zip");
};

const onClickDeleteAll = () => {
  modelValue.value = [];
};

watch(
  modelValue,
  (newList) => {
    console.log("modelValue changed", newList);
    for (const item of newList) {
      if (!(item.image.data.name in checkedMap.value)) {
        checkedMap.value[item.image.data.name] = false;
      }
    }

    const names = new Set(newList.map((item) => item.image.data.name));
    for (const name of Object.keys(checkedMap.value)) {
      if (!names.has(name)) {
        delete checkedMap.value[name];
      }
    }
  },
  { immediate: true, deep: true },
);
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
        <VFormButton class="circle" @click="onClickDownloadZip" v-if="isWeb()">
          {{ $t("convert.download-zip") }}
        </VFormButton>
        <VFormButton class="circle" @click="onClickDownloadAll" v-else>
          {{ $t("convert.download-all") }}
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
        v-model:checked="checkedMap[scaledImage.image.data.name]"
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
