<script setup lang="ts">
import { ref, watch } from "vue";

import ColorSelector from "@/components/ColorSelector.vue";
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormRadio from "@/components/common/VFormRadio.vue";
import LinkList from "@/components/LinkList.vue";
import useColor from "@/composables/useColor";
import { ACCEPTED_TYPES, PICKER_OPTS } from "@/static/imageFile";

import LanguageSelector from "./components/LanguageSelector.vue";
import { FontAwesomeIcons } from "./static/icon";

const { themeColorKey, themeColor } = useColor();
const alerts = ref<string[]>([]);

const originalPixelSizeList = [
  { label: "1px", value: 1 },
  { label: "2px", value: 2 },
  { label: "3px", value: 3 },
  { label: "4px", value: 4 },
];
const originalPixelSize = ref(originalPixelSizeList[0].value);

const scaleModes = [
  { label: "smooth", value: "smooth" },
  { label: "nearest", value: "nearest" },
];
const scaleMode = ref(scaleModes[0].value);

const scaleSizePercentMax = 800;
const scaleSizePercentMin = 100;
const scaleSizePercent = ref(100);

const files = ref<File[]>();
watch(files, (files) => {
  console.log(files?.map((file) => file));
});
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <main>
        <nav>
          <div class="row margin-b-1">
            <div class="col">
              <div class="top-label">
                <FontAwesomeIcon
                  :icon="FontAwesomeIcons['fa-balance-scale']"
                />{{ "original-pixel-size" }}
              </div>
              <VFormRadio
                v-model="originalPixelSize"
                name="original-pixel-size"
                :options="originalPixelSizeList"
              />
            </div>

            <div class="col">
              <div class="top-label">
                <FontAwesomeIcon
                  :icon="FontAwesomeIcons['fa-balance-scale']"
                />scale-mode
              </div>
              <VFormRadio
                v-model="scaleMode"
                name="scale-mode"
                :options="scaleModes"
              />
            </div>

            <div class="col">
              <div class="top-label">
                <FontAwesomeIcon
                  :icon="FontAwesomeIcons['fa-balance-scale']"
                />scale-size-percent
              </div>
              <input
                v-model="scaleSizePercent"
                type="number"
                inputmode="decimal"
                :min="scaleSizePercentMin"
                :max="scaleSizePercentMax"
              />
            </div>
          </div>
        </nav>

        <LanguageSelector />
        <ColorSelector v-model="themeColorKey" />
        <VFormFileInput
          :accepted-types="ACCEPTED_TYPES"
          :picker-opts="PICKER_OPTS"
          @file-change="files = $event"
          @unaccepted-files="console.log"
          >ファイルをどうぞ</VFormFileInput
        >
        <LinkList />
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
