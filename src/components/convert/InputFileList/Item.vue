<script setup lang="ts">
import { ImageEntry } from "@/@types/convert";
import VFormButton from "@/components/common/form/VFormButton.vue";
import VFormCheckBox from "@/components/common/form/VFormCheckBox.vue";
import VFormInput from "@/components/common/form/VFormInput.vue";
import VFormSelectBox from "@/components/common/form/VFormSelectBox.vue";
import {
  ScaleModes,
  ScaleSizePercent,
  OriginalPixelSize,
} from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";

type Emits = {
  convert: [];
  delete: [];
};

const modelValue = defineModel<ImageEntry>({ required: true });
const checked = defineModel<boolean>("checked", { required: true });
defineEmits<Emits>();
</script>

<template>
  <div class="input-file-list-item col margin-tb-1">
    <div class="input-file-list-item__title">
      <VFormCheckBox
        v-model="checked"
        :id="`checked-${modelValue.image.data.name}`"
        :name="`checked-${modelValue.image.data.name}`"
        :label="modelValue.image.data.name"
      />
    </div>
    <div class="input-file-list-item__params">
      <VFormInput
        v-model.number="modelValue.settings.scaleSizePercent"
        :id="`scaleSizePercent-${modelValue.image.data.name}`"
        :name="`scaleSizePercent-${modelValue.image.data.name}`"
        type="number"
        :min="ScaleSizePercent.Min"
        :max="ScaleSizePercent.Max"
        :allow-decimal="false"
      />
      <VFormInput
        v-model.number="modelValue.image.originalPixelSize"
        :id="`originalPixelSize-${modelValue.image.data.name}`"
        :name="`originalPixelSize-${modelValue.image.data.name}`"
        type="number"
        :min="OriginalPixelSize.Min"
        :max="OriginalPixelSize.Max"
        :allow-decimal="false"
      />
      <VFormSelectBox
        v-model="modelValue.settings.scaleMode"
        :id="`scaleMode-${modelValue.image.data.name}`"
        :name="`scaleMode-${modelValue.image.data.name}`"
        :options="ScaleModes"
        :enable-i18n="true"
      />
    </div>
    <div class="input-file-list-item__btn-list">
      <VFormButton :title="$t('form.convert')" @click="$emit('convert')"
        ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-rotate']"
      /></VFormButton>
      <VFormButton :title="$t('delete')" @click="$emit('delete')"
        ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']"
      /></VFormButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../assets/variables.scss";

.input-file-list-item {
  display: grid;
  grid-template-columns: 2fr 1fr 128px;
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
