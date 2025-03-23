<script setup lang="ts">
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormFileInputDrop from "@/components/common/VFormFileInputDrop.vue";
import VFormInput from "@/components/common/VFormInput.vue";
import VFormRadio from "@/components/common/VFormRadio.vue";
import VHintBalloon from "@/components/common/VHintBalloon.vue";
import InputFileList from "@/components/InputFileList.vue";
import ConversionResultsSection from "@/components/sections/ConversionResultsSection.vue";
import HowToUseSection from "@/components/sections/HowToUseSection.vue";
import SettingsSection from "@/components/sections/SettingsSection.vue";
import useImageConvert from "@/composables/useImageConvert";
import useScaleSettings from "@/composables/useScaleSettings";
import {
  ScaleSizePercentMax,
  ScaleSizePercentMin,
  ScaleModes,
  OriginalPixelSizeMin,
  OriginalPixelSizeMax,
} from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";
import { AcceptedTypes, PickerOpts } from "@/constants/imageFile";
import { isUnite } from "@/core/system";

const { originalPixelSize, scaleMode, scaleSizePercent } = useScaleSettings();
const {
  imageEntryList,
  scaledFiles,
  pushFileToInputImageData,
  convert,
  convertOne,
  deleteOneImageEntry,
  isImageEntryListEmpty,
} = useImageConvert();

const onChangeFiles = async (files: File[]) => {
  for (const file of files) {
    try {
      await pushFileToInputImageData(file, {
        originalPixelSize: originalPixelSize.value,
        scaleSizePercent: scaleSizePercent.value,
        scaleModeType: scaleMode.value,
        checked: false,
      });
    } catch (error) {
      console.error(error);
    }
  }
};

const onClickConvert = async () => {
  await convert(scaleMode.value, scaleSizePercent.value);
};

const onClickConvertOne = (index: number) => {
  const entry = imageEntryList.value[index];
  convertOne(
    index,
    entry.settings.scaleModeType,
    entry.settings.scaleSizePercent,
  );
};

const onClickDeleteOne = (index: number) => {
  deleteOneImageEntry(index);
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
            <VFormInput
              v-model="originalPixelSize"
              name="original-pixel-size"
              type="number"
              inputmode="decimal"
              :min="OriginalPixelSizeMin"
              :max="OriginalPixelSizeMax"
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
          <VFormFileInputDrop
            class="box-reverse block"
            data-testid="file-input-area"
            :class="[isImageEntryListEmpty() ? 'padding-0' : '']"
            :accepted-types="AcceptedTypes"
            :picker-opts="PickerOpts"
            @file-change="onChangeFiles"
            @unaccepted-files="console.log"
          >
            <VFormFileInput
              class="center pointer"
              :class="[
                isImageEntryListEmpty()
                  ? 'padding-tb-5'
                  : 'box circle hover active margin-b-2',
              ]"
              :accepted-types="AcceptedTypes"
              :picker-opts="PickerOpts"
              @file-change="onChangeFiles"
              @unaccepted-files="console.log"
            >
              <span>
                <FontAwesomeIcon :icon="FontAwesomeIcons['fa-circle-plus']" />
                {{ $t("form.input-file-area") }}
              </span>
            </VFormFileInput>
            <InputFileList
              v-model="imageEntryList"
              @convert="onClickConvertOne"
              @delete="onClickDeleteOne"
            />
          </VFormFileInputDrop>
        </section>

        <div>
          <div
            class="box circle hover active pointer flex-grow-1"
            @click="onClickConvert"
          >
            <FontAwesomeIcon :icon="FontAwesomeIcons['fa-images']" />
            {{ $t("form.convert") }}
          </div>
        </div>

        <HowToUseSection id="how-to-use" />

        <ConversionResultsSection
          id="conversion-results"
          v-model="scaledFiles"
        />

        <SettingsSection id="settings" />
      </main>

      <footer>(C) {{ new Date().getFullYear() }} ののの茶屋.</footer>
    </div>
  </div>
</template>
