<script setup lang="ts">
import { ref, watch } from "vue";

import ColorSelector from "@/components/ColorSelector.vue";
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormRadio from "@/components/common/VFormRadio.vue";
import useColor from "@/composables/useColor";
import { ACCEPTED_TYPES, PICKER_OPTS } from "@/static/imageFile";

const { themeColorKey, themeColor } = useColor();

const px = [
  { label: "1px", value: 1 },
  { label: "2px", value: 2 },
  { label: "3px", value: 3 },
  { label: "4px", value: 4 },
];
const pxValue = ref(1);

const files = ref<File[]>();
watch(files, (files) => {
  console.log(files?.map((file) => file));
});
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <main>
        <ColorSelector v-model="themeColorKey" />
        <VFormRadio v-model="pxValue" name="px" :options="px" />
        <VFormFileInput
          :accepted-types="ACCEPTED_TYPES"
          :picker-opts="PICKER_OPTS"
          @file-change="files = $event"
          @unaccepted-files="console.log"
          >ファイルをどうぞ</VFormFileInput
        >
      </main>
      <footer>(C) {{ new Date().getFullYear() }} ののの茶屋.</footer>
    </div>
  </div>
</template>

<style lang="scss">
$font: v-bind("themeColor.font");
$background: v-bind("themeColor.background");
$edge-bright: v-bind("themeColor.edgeBright");
$edge-shadow: v-bind("themeColor.edgeShadow");
$scrollbar-background: v-bind("themeColor.scrollbarBackground");
$scrollbar-shadow: v-bind("themeColor.scrollbarShadow");
$scrollbar-thumb: v-bind("themeColor.scrollbarThumb");

@import "./assets/global.scss";
</style>
