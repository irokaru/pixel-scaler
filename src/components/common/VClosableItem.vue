<script setup lang="ts">
import { FontAwesomeIcons } from "@/constants/icon";
const emit = defineEmits(["close"]);
</script>

<template>
  <div class="box">
    <div class="close-btn">
      <span @click="emit('close')">
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-times-circle']" />
      </span>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style src="../../assets/components/common/VClosableItem.scss" scoped></style>
