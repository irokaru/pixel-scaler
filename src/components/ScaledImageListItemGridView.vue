<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { ScaledImage } from "@/@types/convert";
import { FontAwesomeIcons } from "@/constants/icon";

import VFormButton from "./common/VFormButton.vue";

type Props = {
  scaledImage: ScaledImage;
};

defineProps<Props>();
const emits = defineEmits<{
  delete: [];
  download: [];
}>();
</script>

<template>
  <div class="scaled-image-list-item box">
    <div class="scaled-image-list-item__image box-reverse">
      <img :src="scaledImage.file.url" :alt="scaledImage.file.data.name" />
    </div>
    <div class="scaled-image-list-item__info">
      <div class="scaled-image-list-item__info__title">
        {{ scaledImage.file.data.name }}
      </div>
      <div class="scaled-image-list-item__info__params">
        <div class="scaled-image-list-item__info__params__percent">
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-magnifying-glass']" />
          <span> {{ scaledImage.scaledSizePercent }}%</span>
        </div>
        <div class="scaled-image-list-item__info__params__type">
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-terminal']" />
          <span> {{ scaledImage.scaledType }}</span>
        </div>
      </div>
    </div>
    <div class="scaled-image-list-item__buttons">
      <VFormButton @click="emits('download')" :title="$t('convert.download')">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-download']" />
      </VFormButton>
      <VFormButton @click="emits('delete')" :title="$t('delete')">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']" />
      </VFormButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scaled-image-list-item {
  &__image {
    box-sizing: border-box;
    width: 100%;
    padding: 0;
    img {
      display: block;
      height: 250px;
      object-fit: none;
      width: 100%;
    }
  }

  &__info {
    flex-grow: 1;
    &__title {
      font-size: 1.1rem;
      margin: 0.5rem 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    &__params {
      margin: 1rem 0;
      display: flex;
      gap: 0 1rem;
      font-size: 0.9rem;
    }
  }

  &__buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
}
</style>
