<script setup lang="ts">
import { ref } from "vue";

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
  convert: [uuid: string];
  delete: [uuid: string];
  clearErrors: [uuid: string];
};

const modelValue = defineModel<ImageEntry>({ required: true });
const checked = defineModel<boolean>("checked", { required: true });
const emits = defineEmits<Emits>();

const isOpen = ref<boolean>(false);
const toggleOpenErrorList = () => {
  isOpen.value = !isOpen.value;
};

const onClickClearErrors = () => {
  isOpen.value = false;
  emits("clearErrors", modelValue.value.image.uuid);
};
</script>

<template>
  <div class="input-file-list-item margin-tb-1">
    <div class="input-file-list-item__main">
      <div class="input-file-list-item__main__title">
        <VFormCheckBox
          v-model="checked"
          :id="`checked-${modelValue.image.data.name}`"
          :name="`checked-${modelValue.image.data.name}`"
          :label="modelValue.image.data.name"
        />
      </div>
      <div class="input-file-list-item__main__params">
        <VFormButton
          class="input-file-list-item__main__params__errors"
          :title="$t('error.heading', modelValue.errors.length)"
          @click="toggleOpenErrorList"
          v-if="modelValue.errors.length > 0"
        >
          <FontAwesomeIcon
            :icon="FontAwesomeIcons['fa-triangle-exclamation']"
          />{{ modelValue.errors.length }}
        </VFormButton>
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
      <div class="input-file-list-item__main__btn-list">
        <VFormButton
          :title="$t('form.convert')"
          @click="$emit('convert', modelValue.image.uuid)"
        >
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-rotate']" />
        </VFormButton>
        <VFormButton
          :title="$t('delete')"
          @click="$emit('delete', modelValue.image.uuid)"
        >
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']" />
        </VFormButton>
      </div>
    </div>
    <div
      class="input-file-list-item__errors box-reverse block"
      v-if="isOpen && modelValue.errors.length > 0"
    >
      <VFormButton @click="onClickClearErrors">{{ $t("delete") }}</VFormButton>
      <ul class="input-file-list-item__errors__item">
        <li v-for="error in modelValue.errors">
          {{ $t(error.code, error.params) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../assets/variables.scss";

.input-file-list-item {
  &__main {
    display: grid;
    grid-template-columns: 1fr auto 128px;
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

      &__errors {
        font-size: 0.8rem;
        padding: 0.5rem;
        text-align: center;
      }

      input {
        width: 6rem;
        min-width: 6rem;
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

  &__errors {
    margin: 1rem 0;
  }
}
</style>
