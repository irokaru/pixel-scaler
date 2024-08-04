<script setup lang="ts">
import { FontAwesomeIcons } from "@/static/icon";
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

<style src="../../assets/components/VClosableItem.scss" scoped></style>
