<script setup lang="ts">
import { getColorSettingsList } from "@/controllers/colorController";

const COLORS = getColorSettingsList();

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
