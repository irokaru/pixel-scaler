<script setup lang="ts">
import { storeToRefs } from "pinia";

import { ImageCheckList } from "@/@types/convert";
import VFormButton from "@/components/common/form/VFormButton.vue";
import VFormFileInput from "@/components/common/form/VFormFileInput.vue";
import VFormFileInputDrop from "@/components/common/form/VFormFileInputDrop.vue";
import useGlobalError from "@/composables/useGlobalError";
import useI18nTextKey from "@/composables/useI18nTextKey";
import useImageCheckable from "@/composables/useImageCheckable";
import useImageEntryCheckedOperation from "@/composables/useImageEntryCheckedOperation";
import useImageEntryList from "@/composables/useImageEntryList";
import useImageEntrySettings from "@/composables/useImageEntrySettings";
import useScaleSettings from "@/composables/useScaleSettings";
import { FontAwesomeIcons } from "@/constants/icon";
import { AcceptedTypes, PickerOpts } from "@/constants/imageFile";
import { InputError } from "@/models/errors/InputError";
import useImageEntryStore from "@/stores/imageEntryStore";

import InputFileListItemHeader from "./Header.vue";
import InputFileListItem from "./Item.vue";

type Emits = {
  convertAll: [checkedMap: ImageCheckList];
  convertOne: [uuid: string];
  deleteOneError: [uuid: string];
};

const store = useImageEntryStore();
const { imageEntryList } = storeToRefs(store);

const { GlobalErrors } = useGlobalError();

const {
  addFileToImageEntryList,
  clearErrorsOneEntry,
  deleteOne,
  isImageEntryListEmpty,
} = useImageEntryList("input");
const { checkedMap, allChecked, toggleAllChecked, isAnyChecked } =
  useImageCheckable(imageEntryList);
const { deleteAnyChecked } = useImageEntryCheckedOperation("input");

const { applySettings } = useImageEntrySettings(checkedMap);
const { originalPixelSize, scaleMode, scaleSizePercent } = useScaleSettings();

const { convertText, deleteText } = useI18nTextKey(isAnyChecked);

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
    GlobalErrors.value.push(e.toObject());
  }
};

const onClickApply = () => {
  applySettings(
    scaleSizePercent.value,
    originalPixelSize.value,
    scaleMode.value,
  );
};

const onClickClearErrorsOneEntry = (uuid: string) => {
  clearErrorsOneEntry(uuid);
};

const onClickDeleteOneEntry = (uuid: string) => {
  deleteOne(uuid);
};

const onClickDeleteChecked = () => {
  deleteAnyChecked(checkedMap.value);
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
          <VFormButton class="circle" @click="$emit('convertAll', checkedMap)">
            <FontAwesomeIcon :icon="FontAwesomeIcons['fa-images']" />
            <span>{{ $t(convertText) }}</span>
          </VFormButton>
          <VFormButton class="circle" @click="onClickDeleteChecked">
            <FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']" />
            <span>{{ $t(deleteText) }}</span>
          </VFormButton>
        </div>
      </div>
      <div v-if="!isImageEntryListEmpty()">
        <InputFileListItemHeader
          v-model="allChecked"
          v-model:original-pixel-size="originalPixelSize"
          v-model:scale-mode="scaleMode"
          v-model:scale-size-percent="scaleSizePercent"
          :is-any-checked="isAnyChecked"
          @toggle-all-checked="toggleAllChecked"
          @apply="onClickApply"
        />
        <hr />
        <div class="input-file-list">
          <InputFileListItem
            v-for="(imageEntry, index) in imageEntryList"
            :key="index"
            v-model="imageEntryList[index]"
            v-model:checked="checkedMap[imageEntry.image.uuid]"
            @convert="$emit('convertOne', imageEntry.image.uuid)"
            @delete="onClickDeleteOneEntry"
            @clear-errors="onClickClearErrorsOneEntry"
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
