<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { ScaledImage } from "@/@types/convert";
import VFormButton from "@/components/common/VFormButton.vue";
import VFormCheckBox from "@/components/common/VFormCheckBox.vue";
import { FontAwesomeIcons } from "@/constants/icon";

type Props = {
  scaledImage: ScaledImage;
};

const checked = defineModel<boolean>("checked", { required: true });
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
        <VFormCheckBox
          v-model="checked"
          :name="scaledImage.file.data.name"
          :label="scaledImage.file.data.name"
        />
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
      // NOTE: for hidden checkbox box-shadow
      margin: -0.5rem -1rem;
      padding: 1rem;
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
