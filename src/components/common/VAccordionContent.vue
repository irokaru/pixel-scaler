<script setup lang="ts">
import { ref } from "vue";

import { FontAwesomeIcons } from "@/constants/icon";

const isOpen = ref(false);

const toggleAccordion = (event: Event) => {
  isOpen.value = !isOpen.value;
  const target = event.currentTarget as HTMLElement;
  const body = target.nextElementSibling as HTMLElement;
  body.style.maxHeight = isOpen.value ? `${body.scrollHeight}px` : "0px";
};
</script>

<template>
  <div class="accordion-content box-reverse margin-b-1">
    <div class="accordion-content__header" @click="toggleAccordion">
      <slot name="header"></slot>
      <span class="accordion-content__header-icon">
        <FontAwesomeIcon
          :icon="FontAwesomeIcons['fa-angle-down']"
          :rotation="isOpen ? 180 : undefined"
        />
      </span>
    </div>
    <div class="accordion-content__body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.accordion-content {
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  position: relative;
  box-sizing: content-box;

  padding: 0;

  &__header {
    cursor: pointer;
    padding: 1rem;
  }

  &__header-icon {
    position: absolute;
    right: 1rem;
  }

  &__body {
    box-sizing: content-box;
    max-height: 0px;
    transition: max-height 0.3s ease-in-out;
  }
}
</style>
