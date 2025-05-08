<script setup lang="ts">
import { FontAwesomeIcons } from "@/constants/icon";

type Props = {
  position: "top" | "bottom";
};

const props = defineProps<Props>();
</script>

<template>
  <div class="hint-balloon">
    <span class="hint-icon">
      <FontAwesomeIcon :icon="FontAwesomeIcons['fa-circle-question']" />
    </span>
    <div
      class="hint-balloon-content"
      :class="`hint-balloon-content-position--${props.position}`"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hint-balloon {
  position: relative;
  display: inline-block;

  .hint-icon {
    cursor: pointer;
  }

  .hint-balloon-content {
    visibility: hidden;
    min-width: 300px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 0.5em;
    position: absolute;
    z-index: 1;
    left: 50%;
    opacity: 0;
    transition:
      opacity 0.1s,
      visibility 0.1s;
    transform: translateX(-50%);

    &.hint-balloon-content-position--top {
      bottom: 125%;
    }

    &.hint-balloon-content-position--bottom {
      top: 125%;
    }
  }

  &:hover .hint-balloon-content {
    visibility: visible;
    opacity: 1;
  }
}
</style>
