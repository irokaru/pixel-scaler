<script lang="ts" setup>
import useColor from "@/composables/useColor";
import { getAllColors } from "@/core/services/colorService";

const { themeColorKey } = useColor();
const COLORS = getAllColors();

const handleClick = (colorKey: string) => (themeColorKey.value = colorKey);
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
