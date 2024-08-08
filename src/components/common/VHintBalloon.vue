<script lang="ts" setup>
import { FontAwesomeIcons } from "@/static/icon";

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

<style src="../../assets/components/common/VHintBalloon.scss" scoped></style>
