<script lang="ts" setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { ScaledImage } from "@/@types/convert";
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
    <div class="scaled-image-list-item__image">
      <img :src="scaledImage.file.url" :alt="scaledImage.file.data.name" />
    </div>
    <div class="scaled-image-list-item__info">
      <h3>{{ scaledImage.file.data.name }}</h3>
      <p>
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-magnifying-glass']" />
        {{ scaledImage.scaledSizePercent }}
      </p>
      <p>
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-terminal']" />
        {{ scaledImage.scaledType }}
      </p>
    </div>
    <div class="scaled-image-list-item__buttons">
      <div class="box hover active pointer" @click="emits('download')">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-download']" />
      </div>
      <div class="box hover active pointer" @click="emits('delete')">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']" />
      </div>
    </div>
  </div>
</template>
