<script setup lang="ts">
import { ImageCheckList, ImageEntry } from "@/@types/convert";
import { PSCustomErrorObject } from "@/@types/error";
import VFormButton from "@/components/common/VFormButton.vue";
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormFileInputDrop from "@/components/common/VFormFileInputDrop.vue";
import useI18nTextKey from "@/composables/useI18nTextKey";
import useImageCheckable from "@/composables/useImageCheckable";
import useImageEntryCheckedOperation from "@/composables/useImageEntryCheckedOperation";
import useImageEntryList from "@/composables/useImageEntryList";
import useImageEntrySettings from "@/composables/useImageEntrySettings";
import useScaleSettings from "@/composables/useScaleSettings";
import { FontAwesomeIcons } from "@/constants/icon";
import { AcceptedTypes, PickerOpts } from "@/constants/imageFile";
import { InputError } from "@/models/errors/InputError";

import InputFileListItemHeader from "./Header.vue";
import InputFileListItem from "./Item.vue";

type Emits = {
  convertAll: [checkedMap: ImageCheckList];
  convertOne: [ImageEntry];
};

const modelValue = defineModel<ImageEntry[]>({
  required: true,
});
const errors = defineModel<PSCustomErrorObject[]>("errors", { required: true });

const { addFileToImageEntryList, deleteOne, isImageEntryListEmpty } =
  useImageEntryList(modelValue, errors);
const { deleteAnyChecked } = useImageEntryCheckedOperation(modelValue.value);
const { originalPixelSize, scaleMode, scaleSizePercent } = useScaleSettings();
const { checkedMap, allChecked, toggleAllChecked, isAnyChecked } =
  useImageCheckable(modelValue);
const { convertText, deleteText } = useI18nTextKey(isAnyChecked);
const { applySettings } = useImageEntrySettings(modelValue, checkedMap);

defineEmits<Emits>();

const onChangeFiles = async (files: File[]) => {
  for (const file of files) {
    await addFileToImageEntryList(file, {
      originalPixelSize: originalPixelSize.value,
      scaleSizePercent: scaleSizePercent.value,
      scaleMode: scaleMode.value,
    });
  }
};

const onUnacceptedFiles = (files: File[]) => {
  for (const file of files) {
    const e = new InputError("invalid-image-type", { filename: file.name });
    errors.value.push(e.toObject());
  }
};

const onClickApply = () => {
  applySettings(
    scaleSizePercent.value,
    originalPixelSize.value,
    scaleMode.value,
  );
};

const onClickDeleteOneEntry = (index: number) => {
  deleteOne(index);
};

const onClickDeleteChecked = () => {
  modelValue.value = deleteAnyChecked(checkedMap.value);
};
</script>

<template>
  <div>
    <VFormFileInputDrop
      class="box-reverse block"
      data-testid="file-input-area"
      :class="[isImageEntryListEmpty() ? 'padding-0' : '']"
      :accepted-types="AcceptedTypes"
      :picker-opts="PickerOpts"
      @file-change="onChangeFiles"
      @unaccepted-files="onUnacceptedFiles"
    >
      <div :class="[isImageEntryListEmpty() ? '' : 'convert-image-selection']">
        <div class="convert-image-selection__input">
          <VFormFileInput
            class="pointer"
            :class="[
              isImageEntryListEmpty()
                ? 'center padding-tb-5 padding-lr-1'
                : 'box circle hover block active',
            ]"
            :accepted-types="AcceptedTypes"
            :picker-opts="PickerOpts"
            @file-change="onChangeFiles"
            @unaccepted-files="onUnacceptedFiles"
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
          <!-- TODO: error list -->
          <div class="convert-image-selection__buttons__errors">
            <div v-if="errors.length > 0">
              <VFormButton>error</VFormButton>
              <li v-for="error in errors">{{ error }}</li>
            </div>
          </div>
          <div class="convert-image-selection__buttons__ctrl">
            <VFormButton
              class="circle"
              @click="$emit('convertAll', checkedMap)"
            >
              <FontAwesomeIcon :icon="FontAwesomeIcons['fa-images']" />
              <span>{{ $t(convertText) }}</span>
            </VFormButton>
            <VFormButton class="circle" @click="onClickDeleteChecked">
              <FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']" />
              <span>{{ $t(deleteText) }}</span>
            </VFormButton>
          </div>
        </div>
      </div>
      <div v-if="!isImageEntryListEmpty()">
        <InputFileListItemHeader
          v-model="allChecked"
          v-model:original-pixel-size="originalPixelSize"
          v-model:scale-mode="scaleMode"
          v-model:scale-size-percent="scaleSizePercent"
          :is-any-checked="isAnyChecked"
          :on-click-toggle-all-checked="toggleAllChecked"
          :on-click-apply="onClickApply"
        />
        <hr />
        <div class="input-file-list">
          <InputFileListItem
            v-for="(imageEntry, index) in modelValue"
            :key="index"
            v-model="modelValue[index]"
            v-model:checked="checkedMap[imageEntry.image.uuid]"
            @convert="$emit('convertOne', imageEntry)"
            @delete="onClickDeleteOneEntry(index)"
          />
        </div>
      </div>
    </VFormFileInputDrop>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../assets/variables.scss";

.convert-image-selection {
  display: grid;
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

.input-file-list {
  height: 30vh;
  overflow-y: scroll;
  // NOTE: for hidden checkbox box-shadow
  padding: 0 1rem;
  margin: 0 -1rem;
  padding-right: 0.3rem;
  margin-right: -0.633rem;

  &::-webkit-scrollbar {
    width: 0.333rem;
  }

  @media (max-height: variables.$tablet-height) {
    height: 60vh;
  }
}
</style>
