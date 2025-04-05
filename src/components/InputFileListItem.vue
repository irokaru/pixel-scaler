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
</template>

<style lang="scss" scoped>
.input-file-list-item {
  display: grid;
  grid-template-columns: 2fr auto auto;
  gap: 1rem;
  align-items: center;

  &__checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem; // チェックボックス用の固定幅
  }

  &__title {
    position: relative;
    min-width: 0; // グリッドの幅を超えないようにする
  }

  &__ctrl {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: flex-end;
  }

  &__params {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    input {
      min-width: 3.5rem; // 必要最低限の幅を確保（縮小）
      width: 3.5rem; // 固定幅にする
    }
  }

  &__btn-list {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
