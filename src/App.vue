<script setup lang="ts">
import { ref, watch } from "vue";

import ColorSelector from "@/components/ColorSelector.vue";
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormFileInputDrop from "@/components/common/VFormFileInputDrop.vue";
import VFormRadio from "@/components/common/VFormRadio.vue";
import LinkList from "@/components/LinkList.vue";
import useColor from "@/composables/useColor";
import {
  scaleSizePercentMax,
  scaleSizePercentMin,
  scaleModes,
  originalPixelSizeList,
  ScaleModeType,
} from "@/static/form";
import { FontAwesomeIcons } from "@/static/icon";
import { ACCEPTED_TYPES, PICKER_OPTS } from "@/static/imageFile";

import VHintBalloon from "./components/common/VHintBalloon.vue";
import LanguageSelector from "./components/LanguageSelector.vue";
import { isUnite } from "./core/system";

const { themeColorKey, themeColor } = useColor();
const alerts = ref<string[]>([]);

const originalPixelSize = ref(originalPixelSizeList[0].value);
const scaleMode = ref<ScaleModeType>(scaleModes[0].value);
const scaleSizePercent = ref(200);

const files = ref<File[]>([]);
watch(files, (files) => {
  console.log(files?.map((file) => file));
});
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <header>
        <h1 v-if="isUnite()">
          <img
            src="/banner.png"
            :alt="$t('title')"
            onselectstart="return false;"
            onmousedown="return false;"
            oncontextmenu="return false;"
          />
        </h1>
        <h1 v-else>{{ $t("title") }}</h1>
      </header>
      <nav>
        <div class="row margin-b-1">
          <div class="col">
            <div class="top-label">
              <FontAwesomeIcon :icon="FontAwesomeIcons['fa-maximize']" />
              {{ $t("form.original-pixel-size") }}
              <VHintBalloon position="top">
                {{ $t("form.original-pixel-size-hint") }}
              </VHintBalloon>
            </div>
            <VFormRadio
              v-model="originalPixelSize"
              name="original-pixel-size"
              :options="originalPixelSizeList"
            />
          </div>

          <div class="col">
            <div class="top-label">
              <FontAwesomeIcon :icon="FontAwesomeIcons['fa-terminal']" />
              {{ $t("form.scale-mode") }}
            </div>
            <VFormRadio
              v-model="scaleMode"
              name="scale-mode"
              :options="scaleModes"
              :enable-i18n="true"
            />
          </div>

          <div class="col">
            <div class="top-label">
              <FontAwesomeIcon
                :icon="FontAwesomeIcons['fa-magnifying-glass']"
              />
              {{ $t("form.scale-size-percent") }}
            </div>
            <input
              v-model="scaleSizePercent"
              class="flex-grow-1"
              type="number"
              inputmode="decimal"
              :min="scaleSizePercentMin"
              :max="scaleSizePercentMax"
            />
          </div>
        </div>
      </nav>

      <main>
        <section id="file-input">
          <div class="row margin-tb-1">
            <div class="col">
              <VFormFileInputDrop
                class="box"
                :accepted-types="ACCEPTED_TYPES"
                :picker-opts="PICKER_OPTS"
                @file-change="files = $event"
                @unaccepted-files="console.log"
              >
                <label>
                  <VFormFileInput
                    :accepted-types="ACCEPTED_TYPES"
                    :picker-opts="PICKER_OPTS"
                    @file-change="files = $event"
                    @unaccepted-files="console.log"
                  >
                    {{
                      files.length > 0
                        ? $t("form.select", { count: files.length })
                        : $t("form.no-select")
                    }}
                  </VFormFileInput></label
                >
              </VFormFileInputDrop>
            </div>
          </div>
          <div class="row margin-tb-1">
            <div class="col">
              <div
                class="box circle hover active pointer flex-grow-1"
                @click="console.log('TODO: convert')"
              >
                <FontAwesomeIcon :icon="FontAwesomeIcons['fa-images']" />
                {{ $t("form.convert") }}
              </div>
            </div>
          </div>
        </section>
        <section id="how-to-use">
          <!-- TODO: how to use -->
        </section>

        <section id="conversion-results">
          <!-- TODO: conversion results -->
        </section>

        <section id="settings">
          <LanguageSelector />
          <ColorSelector v-model="themeColorKey" />
          <LinkList />
        </section>
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
