<script lang="ts" setup>
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormFileInputDrop from "@/components/common/VFormFileInputDrop.vue";
import InputFileList from "@/components/InputFileList.vue";
import ScaledImageList from "@/components/ScaledImageList.vue";
import useImageConvert from "@/composables/useImageConvert";
import useImageEntryList from "@/composables/useImageEntryList";
import useImageEntrySettings from "@/composables/useImageEntrySettings";
import useScaleSettings from "@/composables/useScaleSettings";
import { FontAwesomeIcons } from "@/constants/icon";
import { AcceptedTypes, PickerOpts } from "@/constants/imageFile";

const {
  imageEntryList,
  pushFileToInputImageData,
  deleteOneImageEntry,
  isImageEntryListEmpty,
} = useImageEntryList();
const { convertAll, convertOne, scaledImages } =
  useImageConvert(imageEntryList);
const { applySettingsToImageEntryList } = useImageEntrySettings(imageEntryList);
const { originalPixelSize, scaleMode, scaleSizePercent } = useScaleSettings();

const onChangeFiles = async (files: File[]) => {
  for (const file of files) {
    try {
      await pushFileToInputImageData(file, {
        originalPixelSize: originalPixelSize.value,
        scaleSizePercent: scaleSizePercent.value,
        scaleMode: scaleMode.value,
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

const onClickApply = () => {
  applySettingsToImageEntryList(
    scaleSizePercent.value,
    originalPixelSize.value,
    scaleMode.value,
  );
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
          v-if="!isImageEntryListEmpty()"
          @click="onClickConvert"
        >
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-images']" />
          {{ $t("form.convert") }}
        </div>
      </div>
      <InputFileList
        v-model="imageEntryList"
        v-model:original-pixel-size="originalPixelSize"
        v-model:scale-mode="scaleMode"
        v-model:scale-size-percent="scaleSizePercent"
        v-if="!isImageEntryListEmpty()"
        @convert="onClickConvertOne"
        @delete="onClickDeleteOne"
        @apply="onClickApply"
      />
    </VFormFileInputDrop>

    <ScaledImageList
      :scaled-images="scaledImages"
      v-if="scaledImages.length > 0"
    />
  </section>
</template>
