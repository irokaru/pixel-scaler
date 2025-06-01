<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";

import { ImageEntry } from "@/@types/convert";
import VFormButton from "@/components/common/form/VFormButton.vue";
import VFormCheckBox from "@/components/common/form/VFormCheckBox.vue";
import { FontAwesomeIcons } from "@/constants/icon";
import { isWeb } from "@/core/system";

type Props = {
  scaledImage: ImageEntry;
  hasOutputPathError: boolean;
};

type Emits = {
  delete: [];
  download: [];
};

const checked = defineModel<boolean>("checked", { required: true });
const { scaledImage } = defineProps<Props>();
defineEmits<Emits>();
const getId = () => {
  return `checked-scaled-${scaledImage.settings.scaleSizePercent}-${scaledImage.image.originalPixelSize}-${scaledImage.settings.scaleMode}-${scaledImage.image.data.name}`;
};

const isWebApp = isWeb();
const downloadButtonProps = computed(() => {
  return isWebApp
    ? {
        icon: FontAwesomeIcons["fa-download"],
        text: "convert.download",
      }
    : {
        icon: FontAwesomeIcons["fa-file-export"],
        text: "convert.output",
      };
});
</script>

<template>
  <div class="scaled-image-list-item box">
    <div class="scaled-image-list-item__image box-reverse">
      <img :src="scaledImage.image.url" :alt="scaledImage.image.data.name" />
    </div>
    <div class="scaled-image-list-item__info">
      <div class="scaled-image-list-item__info__title">
        <VFormCheckBox
          v-model="checked"
          :id="getId()"
          :name="getId()"
          :label="scaledImage.image.data.name"
        />
      </div>
      <div class="scaled-image-list-item__info__params">
        <div class="scaled-image-list-item__info__params__percent">
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-magnifying-glass']" />
          <span> {{ scaledImage.settings.scaleSizePercent }}%</span>
        </div>
        <div class="scaled-image-list-item__info__params__org-pixel">
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-maximize']" />
          <span> {{ scaledImage.image.originalPixelSize }}px</span>
        </div>
        <div class="scaled-image-list-item__info__params__type">
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-terminal']" />
          <span> {{ scaledImage.settings.scaleMode }}</span>
        </div>
      </div>
    </div>
    <div class="scaled-image-list-item__buttons">
      <VFormButton
        @click="$emit('download')"
        :title="$t(downloadButtonProps.text)"
        :disabled="hasOutputPathError"
      >
        <FontAwesomeIcon :icon="downloadButtonProps.icon" />
      </VFormButton>
      <VFormButton @click="$emit('delete')" :title="$t('delete')">
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
