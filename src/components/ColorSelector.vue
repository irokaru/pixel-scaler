<script setup lang="ts">
import { Color } from "../@types/color";

interface Props {
  colors: Record<string, Color>;
}

interface Emits {
  (e: "clicked", colorKey: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const handleClick = (colorKey: string) => emits("clicked", colorKey);
</script>

<template>
  <div id="colors" class="margin-tb-2">
    <div
      v-for="(color, key) in props.colors"
      :key="key"
      :style="{ 'background-color': color.background }"
      class="color-box box circle margin-1 hover active pointer"
      @click="handleClick(key)"
    ></div>
  </div>
</template>

<style src="../assets/components/ColorSelector.scss" scoped></style>
