<script setup lang="ts">
import useColor from "@/composables/useColor";
import { ColorKey } from "@/core/@types/color";
import { getAllColors } from "@/core/services/colorService";

const { themeColorKey } = useColor();
const COLORS = getAllColors();

const handleClick = (colorKey: ColorKey) => (themeColorKey.value = colorKey);
</script>

<template>
  <div id="colors-setting" class="margin-tb-2">
    <div
      v-for="(color, key) in COLORS"
      :key="key"
      :title="key"
      :style="{ 'background-color': color.background }"
      class="color-box box circle margin-1 hover active pointer"
      @click="handleClick(key)"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
#colors-setting {
  .color-box {
    width: 1rem;
    height: 1rem;
  }
}
</style>
