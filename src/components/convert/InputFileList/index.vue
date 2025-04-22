<script setup lang="ts">
import { ImageCheckList, ImageEntry } from "@/@types/convert";
import VFormButton from "@/components/common/VFormButton.vue";
import VFormFileInput from "@/components/common/VFormFileInput.vue";
import VFormFileInputDrop from "@/components/common/VFormFileInputDrop.vue";
import useI18nTextKey from "@/composables/useI18nTextKey";
import useImageCheckable from "@/composables/useImageCheckable";
import useImageEntryList from "@/composables/useImageEntryList";
import useImageEntrySettings from "@/composables/useImageEntrySettings";
import useScaleSettings from "@/composables/useScaleSettings";
import { FontAwesomeIcons } from "@/constants/icon";
import { AcceptedTypes, PickerOpts } from "@/constants/imageFile";

import InputFileListItemHeader from "./Header.vue";
import InputFileListItem from "./Item.vue";

type Emits = {
  convertAll: [checkedMap: ImageCheckList];
  convertOne: [ImageEntry];
};

const imageEntryList = defineModel<ImageEntry[]>("imageEntryList", {
  required: true,
});

const {
  pushFileToInputImageData,
  deleteCheckedImageEntries,
  deleteOneImageEntry,
  isImageEntryListEmpty,
} = useImageEntryList(imageEntryList);
const { originalPixelSize, scaleMode, scaleSizePercent } = useScaleSettings();
const { checkedMap, allChecked, toggleAllChecked, isAnyChecked } =
  useImageCheckable(imageEntryList);
const { convertText, deleteText } = useI18nTextKey(isAnyChecked);
const { applySettings } = useImageEntrySettings(imageEntryList, checkedMap);

defineEmits<Emits>();

const onChangeFiles = async (files: File[]) => {
  for (const file of files) {
    try {
      await pushFileToInputImageData(file, {
        originalPixelSize: originalPixelSize.value,
        scaleSizePercent: scaleSizePercent.value,
        scaleMode: scaleMode.value,
      });
    } catch (error) {
      // TODO: Handle error properly
      console.error(error);
    }
  }
};

const handleApply = () => {
  applySettings(
    scaleSizePercent.value,
    originalPixelSize.value,
    scaleMode.value,
  );
};

const onClickDeleteChecked = () => {
  deleteCheckedImageEntries(checkedMap.value);
};

const onClickDeleteOneEntry = (index: number) => {
  deleteOneImageEntry(index);
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
      @unaccepted-files="console.log"
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
          @click="toggleAllChecked"
          @apply="handleApply"
        />
        <hr />
        <div class="input-file-list">
          <InputFileListItem
            v-for="(imageEntry, index) in imageEntryList"
            :key="index"
            v-model="imageEntryList[index]"
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
