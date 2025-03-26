<script lang="ts" setup>
import { ScaleModeType } from "@/@types/convert";
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormFileInputDrop from "@/components/common/VFormFileInputDrop.vue";
import InputFileList from "@/components/InputFileList.vue";
import useImageConvert from "@/composables/useImageConvert";
import { FontAwesomeIcons } from "@/constants/icon";
import { AcceptedTypes, PickerOpts } from "@/constants/imageFile";
const {
  imageEntryList,
  pushFileToInputImageData,
  convertAll,
  convertOne,
  scaledFiles,
  deleteOneImageEntry,
  isImageEntryListEmpty,
} = useImageConvert();

type Props = {
  originalPixelSize: number;
  scaleMode: ScaleModeType;
  scaleSizePercent: number;
};

const { originalPixelSize, scaleMode, scaleSizePercent } = defineProps<Props>();

const onChangeFiles = async (files: File[]) => {
  for (const file of files) {
    try {
      await pushFileToInputImageData(file, {
        originalPixelSize,
        scaleSizePercent,
        scaleMode,
        checked: false,
      });
    } catch (error) {
      console.error(error);
    }
  }
};

const onClickConvert = async () => {
  await convertAll();
};

const onClickConvertOne = (index: number) => {
  convertOne(index);
};

const onClickDeleteOne = (index: number) => {
  deleteOneImageEntry(index);
};
</script>

<template>
  <section>
    <VFormFileInputDrop
      class="box-reverse block"
      data-testid="file-input-area"
      :class="[isImageEntryListEmpty() ? 'padding-0' : '']"
      :accepted-types="AcceptedTypes"
      :picker-opts="PickerOpts"
      @file-change="onChangeFiles"
      @unaccepted-files="console.log"
    >
      <div
        :class="[isImageEntryListEmpty() ? '' : 'row margin-b-2 row-gap-lr-1']"
      >
        <VFormFileInput
          class="pointer"
          :class="[
            isImageEntryListEmpty()
              ? 'center padding-tb-5'
              : 'box circle hover flex-grow-3 active',
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
        <div
          class="box circle hover active pointer flex-grow-2"
          v-show="!isImageEntryListEmpty()"
          @click="onClickConvert"
        >
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-images']" />
          {{ $t("form.convert") }}
        </div>
      </div>
      <InputFileList
        v-model="imageEntryList"
        @convert="onClickConvertOne"
        @delete="onClickDeleteOne"
      />
    </VFormFileInputDrop>

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
