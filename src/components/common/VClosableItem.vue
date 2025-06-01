<script setup lang="ts">
import { FontAwesomeIcons } from "@/constants/icon";
type Emits = {
  close: [];
};
defineEmits<Emits>();
</script>

<template>
  <div class="closable-item box">
    <div class="closable-item__wrapper">
      <div class="content">
        <slot />
      </div>
      <div class="close-btn">
        <span @click="$emit('close')">
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-times-circle']" />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.closable-item {
  &__wrapper {
    display: flex;
    justify-content: space-between;

    .close-btn {
      span {
        cursor: pointer;
        transition: opacity 0.25s;

        &:hover {
          opacity: 0.75;
        }
      }
    }
  }
}
</style>
