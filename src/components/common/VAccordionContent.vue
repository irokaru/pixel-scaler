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
      <div class="accordion-content__header-content">
        <slot name="header"></slot>
      </div>
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 1rem;

    &-content {
      flex: 1;
    }

    &-icon {
      margin-left: 0.5rem;
    }
  }

  &__body {
    box-sizing: content-box;
    max-height: 0px;
    transition: max-height 0.3s ease-in-out;
  }
}
</style>
