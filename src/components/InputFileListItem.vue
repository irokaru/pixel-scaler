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
const emits = defineEmits<{
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
      <VFormButton :title="$t('form.convert')" @click="emits('convert')"
        ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-rotate']"
      /></VFormButton>
      <VFormButton :title="$t('delete')" @click="emits('delete')"
        ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']"
      /></VFormButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../assets/variables.scss";

.input-file-list-item {
  display: grid;
  grid-template-columns: 2fr 1fr 108px;
  grid-template-areas: "title params btns";
  gap: 1rem;
  align-items: center;

  &__title {
    grid-area: title;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__params {
    grid-area: params;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: nowrap;
    min-width: 0;

    input {
      width: 5rem;
      min-width: 5rem;
      flex-shrink: 1;
    }
  }

  &__btn-list {
    grid-area: btns;
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }

  @media (max-width: variables.$tablet-width) {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "title title"
      "params btns";

    &__params {
      justify-content: flex-end;
      flex-wrap: wrap;

      input {
        width: 4.5rem;
      }
    }

    &__btn-list {
      justify-content: flex-end;
    }
  }
  @media (max-width: variables.$smartphone-width) {
    grid-template-columns: auto;
    grid-template-areas:
      "title title"
      "params params"
      "btns btns";
  }
}
</style>
