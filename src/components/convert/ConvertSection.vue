<script lang="ts" setup>
import VFormButton from "@/components/common/VFormButton.vue";
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormFileInputDrop from "@/components/common/VFormFileInputDrop.vue";
import useImageConvert from "@/composables/useImageConvert";
import useImageEntryList from "@/composables/useImageEntryList";
import useScaleSettings from "@/composables/useScaleSettings";
import { FontAwesomeIcons } from "@/constants/icon";
import { AcceptedTypes, PickerOpts } from "@/constants/imageFile";

import InputFileList from "./InputFileList/index.vue";
import ScaledImageList from "./ScaledImageList/index.vue";

const {
  imageEntryList,
  pushFileToInputImageData,
  deleteOneImageEntry,
  isImageEntryListEmpty,
} = useImageEntryList();
const { convertAll, convertOne, scaledImages } =
  useImageConvert(imageEntryList);
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
      // TODO: Handle error properly
      console.error(error);
    }
  }
};

const onClickConvertAllEntries = async () => {
  await convertAll();
};

const onClickConvertOneEntry = (index: number) => {
  convertOne(index);
};

const onClickDeleteAllEntries = () => {
  imageEntryList.value = [];
};

const onClickDeleteOneEntry = (index: number) => {
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
      <div :class="[isImageEntryListEmpty() ? '' : 'convert-image-selection']">
        <div class="convert-image-selection__input">
          <VFormFileInput
            class="pointer"
            :class="[
              isImageEntryListEmpty()
                ? 'center padding-tb-5'
                : 'box circle hover block active',
            ]"
            :accepted-types="AcceptedTypes"
            :picker-opts="PickerOpts"
            @file-change="onChangeFiles"
            @unaccepted-files="console.log"
          >
            <span>
              <FontAwesomeIcon :icon="FontAwesomeIcons['fa-folder-open']" />
              {{ $t("form.input-file-area") }}
            </span>
          </VFormFileInput>
        </div>
        <div
          class="convert-image-selection__buttons"
          v-if="!isImageEntryListEmpty()"
        >
          <VFormButton class="circle" @click="onClickConvertAllEntries">
            <FontAwesomeIcon :icon="FontAwesomeIcons['fa-images']" />
            <span>{{ $t("form.convert-all") }}</span>
          </VFormButton>
          <VFormButton class="circle" @click="onClickDeleteAllEntries">
            <FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']" />
            <span>{{ $t("delete-all") }}</span>
          </VFormButton>
        </div>
      </div>
      <InputFileList
        v-model="imageEntryList"
        v-model:original-pixel-size="originalPixelSize"
        v-model:scale-mode="scaleMode"
        v-model:scale-size-percent="scaleSizePercent"
        v-if="!isImageEntryListEmpty()"
        @convert="onClickConvertOneEntry"
        @delete="onClickDeleteOneEntry"
      />
    </VFormFileInputDrop>

    <div class="box-reverse block margin-tb-2" v-if="scaledImages.length > 0">
      <ScaledImageList v-model="scaledImages" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use "../../assets/variables.scss";

.convert-image-selection {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 1rem;

  &__input {
    justify-content: center;
  }

  &__buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;

    & .v-form-button span {
      margin-left: 0.5rem;
    }
  }

  @media (max-width: variables.$tablet-width) {
    grid-template-columns: 1fr;

    &__buttons {
      justify-content: flex-end;
    }
  }
}
</style>
