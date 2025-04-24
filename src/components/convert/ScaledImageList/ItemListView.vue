<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { ImageEntry } from "@/@types/convert";
import VFormButton from "@/components/common/VFormButton.vue";
import VFormCheckBox from "@/components/common/VFormCheckBox.vue";
import { FontAwesomeIcons } from "@/constants/icon";

type Props = {
  scaledImage: ImageEntry;
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
</script>

<template>
  <div class="scaled-image-list-item box">
    <div class="scaled-image-list-item__title">
      <VFormCheckBox
        v-model="checked"
        :id="getId()"
        :name="getId()"
        :label="scaledImage.image.data.name"
      />
    </div>
    <div class="scaled-image-list-item__info">
      <div class="scaled-image-list-item__info__percent">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-magnifying-glass']" />
        <span> {{ scaledImage.settings.scaleSizePercent }}%</span>
      </div>
      <div class="scaled-image-list-item__info__params__org-pixel">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-maximize']" />
        <span> {{ scaledImage.image.originalPixelSize }}px</span>
      </div>

      <div class="scaled-image-list-item__info__type">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-terminal']" />
        <span> {{ scaledImage.settings.scaleMode }}</span>
      </div>
    </div>
    <div class="scaled-image-list-item__buttons">
      <VFormButton @click="$emit('download')">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-download']" />
        {{ $t("convert.download") }}
      </VFormButton>
      <VFormButton @click="$emit('delete')">
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
    // NOTE: for hidden checkbox box-shadow
    margin: -1rem;
    padding: 1rem;
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
