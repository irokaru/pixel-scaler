<script setup lang="ts">
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormFileInputDrop from "@/components/common/VFormFileInputDrop.vue";
import InputFileList from "@/components/InputFileList.vue";
import useImageConvert from "@/composables/useImageConvert";
import useScaleSettings from "@/composables/useScaleSettings";
import { FontAwesomeIcons } from "@/constants/icon";
import { AcceptedTypes, PickerOpts } from "@/constants/imageFile";
const { originalPixelSize, scaleMode, scaleSizePercent } = useScaleSettings();
const {
  imageEntryList,
  pushFileToInputImageData,
  convert,
  convertOne,
  scaledFiles,
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

    <div>
      <div
        class="box circle hover active pointer flex-grow-1"
        @click="onClickConvert"
      >
        <FontAwesomeIcon :icon="FontAwesomeIcons['fa-images']" />
        {{ $t("form.convert") }}
      </div>
    </div>

    <div
      v-for="{ file, scaledSizePercent, scaledType } in scaledFiles"
      :key="file.data.name + scaledSizePercent + scaledType"
    >
      <!-- TODO: conversion results -->
      <h2>{{ file.data.name }}</h2>
      <img :src="file.url" :alt="file.data.name" />
    </div>
  </section>
</template>
