<script lang="ts" setup>
import { ScaledImage } from "@/@types/convert";

type Props = {
  scaledImage: ScaledImage;
};

defineProps<Props>();
</script>

<template>
  <div class="scaled-image-list-item box">
    <div class="scaled-image-list-item__image">
      <img :src="scaledImage.file.url" :alt="scaledImage.file.data.name" />
    </div>
    <div class="scaled-image-list-item__info">
      <h3>{{ scaledImage.file.data.name }}</h3>
      <p>ScaledPer: {{ scaledImage.scaledSizePercent }} bytes</p>
      <p>scaledType: {{ scaledImage.scaledType }}</p>
    </div>
  </div>
</template>
