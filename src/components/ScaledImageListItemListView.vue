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
    <div class="scaled-image-list-item__info">
      <h3>{{ scaledImage.file.data.name }}</h3>
      <span
        ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-magnifying-glass']" />
        {{ scaledImage.scaledSizePercent }}</span
      >
      <span
        ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-terminal']" />
        {{ scaledImage.scaledType }}</span
      >
    </div>
    <div class="scaled-image-list-item__buttons">
      <div class="box hover active pointer" @click="emits('download')">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-download']" />
        {{ $t("convert.download") }}
      </div>
      <div class="box hover active pointer" @click="emits('delete')">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']" />{{
          $t("delete")
        }}
      </div>
    </div>
  </div>
</template>
