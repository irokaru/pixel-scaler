<script setup lang="ts">
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormFileInputDrop from "@/components/common/VFormFileInputDrop.vue";
import VFormRadio from "@/components/common/VFormRadio.vue";
import VHintBalloon from "@/components/common/VHintBalloon.vue";
import InputFileList from "@/components/InputFileList.vue";
import ConversionResultsSection from "@/components/sections/ConversionResultsSection.vue";
import HowToUseSection from "@/components/sections/HowToUseSection.vue";
import SettingsSection from "@/components/sections/SettingsSection.vue";
import useColor from "@/composables/useColor";
import useImageConvert from "@/composables/useImageConvert";
import useScaleSettings from "@/composables/useScaleSettings";
import {
  ScaleSizePercentMax,
  ScaleSizePercentMin,
  ScaleModes,
  originalPixelSizeList,
} from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";
import { AcceptedTypes, PickerOpts } from "@/constants/imageFile";
import { isUnite } from "@/core/system";

import { ConvertedFile } from "./@types/convert";

const { themeColorKey, themeColor } = useColor();
const { originalPixelSize, scaleMode, scaleSizePercent } = useScaleSettings();
const {
  imageEntryList,
  scaledFiles,
  pushFileToInputImageData,
  convert,
  convertOne,
  createConvertError,
} = useImageConvert();

const onChangeFiles = async (files: File[]) => {
  for (const file of files) {
    try {
      await pushFileToInputImageData(file, {
        originalPixelSize: originalPixelSize.value,
        scaleSizePercent: scaleSizePercent.value,
        scaleModeType: scaleMode.value,
      });
    } catch (error) {
      console.error(error);
    }
  }
};

const onClickConvert = async () => {
  // TODO: error handling
  const { results, errors } = await convert(
    scaleMode.value,
    scaleSizePercent.value,
  );
  scaledFiles.value.push(...results);
  console.error(errors);
};

const onClickConvertOne = async (index: number) => {
  const entry = imageEntryList.value[index];
  try {
    const result = await convertOne(
      index,
      entry.settings.scaleModeType,
      entry.settings.scaleSizePercent,
    );
    scaledFiles.value.push(result);
  } catch (error) {
    createConvertError(entry.image, error);
  }
};
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
              :options="ScaleModes"
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
              :min="ScaleSizePercentMin"
              :max="ScaleSizePercentMax"
            />
          </div>
        </div>
      </nav>

      <main>
        <section id="file-input">
          <div class="row margin-tb-1">
            <div class="col">
              <VFormFileInputDrop
                class="box hover active pointer"
                :accepted-types="AcceptedTypes"
                :picker-opts="PickerOpts"
                @file-change="onChangeFiles"
                @unaccepted-files="console.log"
              >
                <VFormFileInput
                  class="pointer"
                  :accepted-types="AcceptedTypes"
                  :picker-opts="PickerOpts"
                  @file-change="onChangeFiles"
                  @unaccepted-files="console.log"
                >
                  {{
                    imageEntryList.length > 0
                      ? $t("form.select", { count: imageEntryList.length })
                      : $t("form.no-select")
                  }}
                </VFormFileInput>
              </VFormFileInputDrop>
            </div>
          </div>
          <div class="row margin-tb-1">
            <div class="col">
              <div
                class="box circle hover active pointer flex-grow-1"
                @click="onClickConvert"
              >
                <FontAwesomeIcon :icon="FontAwesomeIcons['fa-images']" />
                {{ $t("form.convert") }}
              </div>
            </div>
          </div>
        </section>

        <InputFileList v-model="imageEntryList" @convert="onClickConvertOne" />

        <HowToUseSection id="how-to-use" />

        <ConversionResultsSection
          id="conversion-results"
          v-model="scaledFiles as ConvertedFile[]"
        />

        <SettingsSection
          id="settings"
          v-model:theme-color-key="themeColorKey"
        />
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
