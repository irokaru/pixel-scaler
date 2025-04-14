<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { ScaledImage } from "@/@types/convert";
import VFormButton from "@/components/common/VFormButton.vue";
import { FontAwesomeIcons } from "@/constants/icon";

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
    <div class="scaled-image-list-item__title">
      {{ scaledImage.file.data.name }}
    </div>
    <div class="scaled-image-list-item__info">
      <div class="scaled-image-list-item__info__percent">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-magnifying-glass']" />
        <span> {{ scaledImage.scaledSizePercent }}%</span>
      </div>
      <div class="scaled-image-list-item__info__type">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-terminal']" />
        <span> {{ scaledImage.scaledType }}</span>
      </div>
    </div>
    <div class="scaled-image-list-item__buttons">
      <VFormButton @click="emits('download')">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-download']" />
        {{ $t("convert.download") }}
      </VFormButton>
      <VFormButton @click="emits('delete')">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']" />{{
          $t("delete")
        }}
      </VFormButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scaled-image-list-item {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  align-items: center;
  gap: 0 1rem;

  &__title {
    font-size: 1.1rem;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  &__params {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__buttons {
    font-size: 0.9rem;
    display: flex;
    justify-content: center;
    gap: 0 1rem;
  }
}
</style>
