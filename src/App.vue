<script setup lang="ts">
import { ref } from "vue";

import { getColorSettings } from "./services/colorService";

const color = ref(getColorSettings());
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank"> </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
</template>

<style lang="scss" scoped>
$font: v-bind("color.font");
$background: v-bind("color.background");
$edge-bright: v-bind("color.edgeBright");
$edge-shadow: v-bind("color.edgeShadow");
$scrollbar-background: v-bind("color.scrollbarBackground");
$scrollbar-shadow: v-bind("color.scrollbarShadow");
$scrollbar-thumb: v-bind("color.scrollbarThumb");

@import "./assets/global.scss";
</style>
