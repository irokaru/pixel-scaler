<script setup lang="ts">
import { getAllColors } from "@/services/colorService";

const COLORS = getAllColors();

const modelValue = defineModel<string>({ required: true });

const handleClick = (colorKey: string) => (modelValue.value = colorKey);
</script>

<template>
  <div id="colors" class="margin-tb-2">
    <div
      v-for="(color, key) in COLORS"
      :key="key"
      :style="{ 'background-color': color.background }"
      class="color-box box circle margin-1 hover active pointer"
      @click="handleClick(key)"
    ></div>
  </div>
</template>

<style src="../assets/components/ColorSelector.scss" scoped></style>
