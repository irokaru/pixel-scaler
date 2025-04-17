<script setup lang="ts">
import VFormButton from "@/components/common/VFormButton.vue";
import VFormCheckBox from "@/components/common/VFormCheckBox.vue";
import VFormInput from "@/components/common/VFormInput.vue";
import VFormSelectBox from "@/components/common/VFormSelectBox.vue";
import VHintBalloon from "@/components/common/VHintBalloon.vue";
import {
  ScaleSizePercent,
  OriginalPixelSize,
  ScaleModes,
} from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";

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
    class="input-file-list-item-header col margin-tb-1"
    data-testid="input-file-list-item-header__header"
  >
    <div class="input-file-list-item-header__title">
      <VFormCheckBox
        v-model="modelValue"
        name="all-check"
        @click="emit('click')"
        label=""
      />
    </div>
    <div class="input-file-list-item-header__ctrl">
      <label for="scaleSizePercent">
        <span
          ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-magnifying-glass']" />
          {{ $t("form.scale-size-percent") }}</span
        >
        <VFormInput
          v-model.number="scaleSizePercent"
          name="scaleSizePercent"
          type="number"
          :min="ScaleSizePercent.Min"
          :max="ScaleSizePercent.Max"
          :allow-decimal="false"
        />
      </label>
      <label for="originalPixelSize">
        <span
          ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-maximize']" />
          {{ $t("form.original-pixel-size") }}
          <VHintBalloon position="top">{{
            $t("form.original-pixel-size-hint")
          }}</VHintBalloon>
        </span>
        <VFormInput
          v-model.number="originalPixelSize"
          name="originalPixelSize"
          type="number"
          :min="OriginalPixelSize.Min"
          :max="OriginalPixelSize.Max"
          :allow-decimal="false"
        />
      </label>
      <label for="scaleMode">
        <span
          ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-terminal']" />
          {{ $t("form.scale-mode") }}
        </span>
        <VFormSelectBox
          v-model="scaleMode"
          name="scaleMode"
          :options="ScaleModes"
          :enable-i18n="true"
        />
      </label>
    </div>

    <div class="input-file-list-item-header__btn-list">
      <VFormButton :title="$t('form.convert')" @click="emit('apply')"
        ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-sliders']" />
        {{ $t("form.apply") }}</VFormButton
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../assets/variables.scss";

.input-file-list-item-header {
  display: grid;
  grid-template-columns: 3fr 1.5fr 108px;
  grid-template-areas: "title params btns";
  gap: 1rem;
  align-items: center;

  label {
    span {
      font-size: 0.9rem;
      padding-bottom: 0.25rem;
    }
  }

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
