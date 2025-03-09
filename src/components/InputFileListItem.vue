<script lang="ts" setup>
import { ImageEntry } from "@/@types/convert";
import {
  ScaleSizePercentMax,
  ScaleSizePercentMin,
  OriginalPixelSizeMin,
  OriginalPixelSizeMax,
} from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";

import VFormButton from "./common/VFormButton.vue";
import VFormCheckBox from "./common/VFormCheckBox.vue";
import VFormInput from "./common/VFormInput.vue";

type Props = {
  index: number;
};

const modelValue = defineModel<ImageEntry>({ required: true });
const props = defineProps<Props>();
const emit = defineEmits<{
  convert: [];
  delete: [];
}>();
</script>

<template>
  <div
    class="input-file-list-item"
    :data-testid="`input-file-list-item__id-${props.index}`"
  >
    <div class="input-file-list-item__title">
      <VFormCheckBox
        v-model="modelValue.settings.checked"
        :name="modelValue.image.data.name"
        :label="modelValue.image.data.name"
      />
      <VFormInput
        v-model.number="modelValue.settings.scaleSizePercent"
        name="scaleSizePercent"
        type="number"
        :min="ScaleSizePercentMin"
        :max="ScaleSizePercentMax"
      />
      <VFormInput
        v-model.number="modelValue.image.originalPixelSize"
        name="originalPixelSize"
        type="number"
        :min="OriginalPixelSizeMin"
        :max="OriginalPixelSizeMax"
        :allow-decimal="false"
      />
      <VFormButton title="変換" @click="emit('convert')"
        ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-rotate']"
      /></VFormButton>
      <VFormButton title="削除" @click="emit('delete')"
        ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']"
      /></VFormButton>
    </div>
  </div>
</template>
