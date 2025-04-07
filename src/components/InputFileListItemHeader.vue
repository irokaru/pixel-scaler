<script lang="ts" setup>
import {
  ScaleSizePercent,
  OriginalPixelSize,
  ScaleModes,
} from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";

import VFormButton from "./common/VFormButton.vue";
import VFormCheckBox from "./common/VFormCheckBox.vue";
import VFormInput from "./common/VFormInput.vue";
import VFormSelectBox from "./common/VFormSelectBox.vue";

const modelValue = defineModel<boolean>({
  required: true,
});
const originalPixelSize = defineModel<number>("originalPixelSize", {
  required: true,
});
const scaleMode = defineModel<string>("scaleMode", { required: true });
const scaleSizePercent = defineModel<number>("scaleSizePercent", {
  required: true,
});
const emit = defineEmits<{
  click: [];
  apply: [];
}>();
</script>

<template>
  <div
    class="input-file-list-item col margin-tb-1"
    data-testid="input-file-list-item__header"
  >
    <div class="input-file-list-item__title">
      <VFormCheckBox
        v-model="modelValue"
        name="all-check"
        @click="emit('click')"
        label=""
      />
    </div>
    <div class="input-file-list-item__ctrl">
      <VFormInput
        v-model.number="scaleSizePercent"
        name="scaleSizePercent"
        type="number"
        :min="ScaleSizePercent.Min"
        :max="ScaleSizePercent.Max"
        :allow-decimal="false"
      />
      <VFormInput
        v-model.number="originalPixelSize"
        name="originalPixelSize"
        type="number"
        :min="OriginalPixelSize.Min"
        :max="OriginalPixelSize.Max"
        :allow-decimal="false"
      />
      <VFormSelectBox
        v-model="scaleMode"
        name="scaleMode"
        :options="ScaleModes"
        :enable-i18n="true"
      />
    </div>

    <div class="input-file-list-item__btn-list">
      <VFormButton :title="$t('form.convert')" @click="emit('apply')"
        ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-rotate']" />{{
          $t("form.apply")
        }}</VFormButton
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../assets/variables.scss";

.input-file-list-item {
  display: grid;
  grid-template-columns: 3fr 1.5fr auto;
  grid-template-areas: "title params btns";
  gap: 1rem;
  align-items: center;

  &__title {
    grid-area: title;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__ctrl {
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

    &__ctrl {
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
