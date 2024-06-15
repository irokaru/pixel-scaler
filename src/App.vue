<script setup lang="ts">
import { ref, watch } from "vue";

import ColorSelector from "@/components/ColorSelector.vue";
import useColor from "@/composables/useColor";

import VFormFileInput from "./components/VFormFileInput.vue";
import VFormRadio from "./components/VFormRadio.vue";
import { ACCEPTED_TYPES, PICKER_OPTS } from "./static/imageFile";

const { COLORS, color, updateColorKey } = useColor();

const px = [
  { label: "1px", value: "1" },
  { label: "2px", value: "2" },
  { label: "3px", value: "3" },
  { label: "4px", value: "4" },
];
const pxValue = ref("1");

const files = ref<File[]>();
watch(files, (files) => {
  console.log(files?.map((file) => file));
});
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <main>
        <ColorSelector :colors="COLORS" @clicked="updateColorKey" />
        <VFormRadio v-model="pxValue" name="px" :options="px" />
        <VFormFileInput
          :accept-types="ACCEPTED_TYPES"
          :picker-opts="PICKER_OPTS"
          @file-change="files = $event"
          >ファイルをどうぞ</VFormFileInput
        >
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
