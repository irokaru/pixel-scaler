<script lang="ts" setup>
import { InputImageDataObject } from "@/@types/convert";
import { FontAwesomeIcons } from "@/constants/icon";

import VFormButton from "./common/VFormButton.vue";

type Props = {
  index: number;
};

const modelValue = defineModel<InputImageDataObject>({ required: true });
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
      <span>{{ modelValue.data.name }}</span>
      <input type="checkbox" name="checked" />
      <input
        v-model.number="modelValue.originalPixelSize"
        type="number"
        name="originalPixelSize"
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
