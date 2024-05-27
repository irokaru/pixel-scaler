<script setup lang="ts">
import { ref } from "vue";

import ColorSelector from "@/components/ColorSelector.vue";
import { getColorsSettings } from "@/controllers/colorController";
import { getColorSettings, setColorKey } from "@/services/colorService";

const COLORS = getColorsSettings();

const color = ref(getColorSettings());

const updateColorKey = (key: string) => {
  setColorKey(key);
  color.value = getColorSettings();
};
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <main>
        <ColorSelector :colors="COLORS" @clicked="updateColorKey" />
      </main>
      <footer>(C) {{ new Date().getFullYear() }} ののの茶屋.</footer>
    </div>
  </div>
</template>

<style lang="scss">
$font: v-bind("color.font");
$background: v-bind("color.background");
$edge-bright: v-bind("color.edgeBright");
$edge-shadow: v-bind("color.edgeShadow");
$scrollbar-background: v-bind("color.scrollbarBackground");
$scrollbar-shadow: v-bind("color.scrollbarShadow");
$scrollbar-thumb: v-bind("color.scrollbarThumb");

@import "./assets/global.scss";
</style>
