<script lang="ts" setup>
import { ImageEntry } from "@/@types/convert";
import {
  ScaleModes,
  ScaleSizePercent,
  OriginalPixelSize,
} from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";

import VFormButton from "./common/VFormButton.vue";
import VFormCheckBox from "./common/VFormCheckBox.vue";
import VFormInput from "./common/VFormInput.vue";
import VFormSelectBox from "./common/VFormSelectBox.vue";

type Props = {
  index: number;
};

const modelValue = defineModel<ImageEntry>({ required: true });
defineProps<Props>();
const emit = defineEmits<{
  convert: [];
  delete: [];
}>();
</script>

<template>
  <div
    class="input-file-list-item col margin-tb-1"
    :data-testid="`input-file-list-item__id-${index}`"
  >
    <div class="input-file-list-item__title">
      <VFormCheckBox
        v-model="modelValue.settings.checked"
        :name="modelValue.image.data.name"
        :label="modelValue.image.data.name"
      />
    </div>
    <div class="input-file-list-item__ctrl">
      <div class="input-file-list-item__params">
        <VFormInput
          v-model.number="modelValue.settings.scaleSizePercent"
          name="scaleSizePercent"
          type="number"
          :min="ScaleSizePercent.Min"
          :max="ScaleSizePercent.Max"
          :allow-decimal="false"
        />
        <VFormInput
          v-model.number="modelValue.image.originalPixelSize"
          name="originalPixelSize"
          type="number"
          :min="OriginalPixelSize.Min"
          :max="OriginalPixelSize.Max"
          :allow-decimal="false"
        />
        <VFormSelectBox
          v-model="modelValue.settings.scaleMode"
          name="scaleMode"
          :options="ScaleModes"
          :enable-i18n="true"
        />
      </div>
      <div class="input-file-list-item__btn-list">
        <VFormButton :title="$t('form.convert')" @click="emit('convert')"
          ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-rotate']"
        /></VFormButton>
        <VFormButton :title="$t('form.delete')" @click="emit('delete')"
          ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']"
        /></VFormButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-file-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__title {
    flex-grow: 1;
    font-size: 1.1rem;
    font-weight: bold;
  }

  &__ctrl {
    flex-shrink: 0;
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  &__params {
    display: flex;
    gap: 1rem;

    input {
      width: 5rem;
    }
  }

  &__btn-list {
    display: flex;
    gap: 0.5rem;

    .v-form-button {
      &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
}
</style>
