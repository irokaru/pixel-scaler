<script setup lang="ts">
import ColorSelector from "@/components/ColorSelector.vue";
import useColor from "@/composables/useColor";

const { COLORS, color, updateColorKey } = useColor();
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
