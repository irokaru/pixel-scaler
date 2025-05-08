<script setup lang="ts">
import { computed } from "vue";

import { ResultDisplayStyleType } from "@/@types/form";
import VFormButton from "@/components/common/form/VFormButton.vue";
import VFormCheckBox from "@/components/common/form/VFormCheckBox.vue";
import VFormRadio from "@/components/common/form/VFormRadio.vue";
import useI18nTextKey from "@/composables/useI18nTextKey";
import { ResultDisplayStyleOptions } from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";
import { isWeb } from "@/core/system";

type Props = {
  isAnyChecked: boolean;
};
type Emits = {
  toggleAllChecked: [];
  downloadZip: [];
  downloadAll: [];
  deleteAll: [];
};

const modelValue = defineModel<boolean>({
  required: true,
});
const displayStyle = defineModel<ResultDisplayStyleType>("displayStyle", {
  required: true,
});
const { isAnyChecked } = defineProps<Props>();
const isAnyCheckedRef = computed(() => isAnyChecked);
const { deleteText, downloadZipText, downloadFileText } =
  useI18nTextKey(isAnyCheckedRef);
defineEmits<Emits>();
</script>

<template>
  <div class="scaled-image-list__ctrl padding-t-1">
    <div class="scaled-image-list__ctrl__display">
      <VFormRadio
        name="displayStyle"
        v-model="displayStyle"
        :options="ResultDisplayStyleOptions"
        :enable-i18n="true"
      />
    </div>
    <div class="scaled-image-list__ctrl__buttons">
      <div class="scaled-image-list__ctrl__buttons__all-checkbox">
        <VFormCheckBox
          v-model="modelValue"
          id="all-check-converted-list"
          name="all-check-converted-list"
          label=""
          @click="$emit('toggleAllChecked')"
        />
      </div>
      <div class="scaled-image-list__ctrl__buttons__buttons">
        <VFormButton
          class="circle"
          @click="$emit('downloadZip')"
          v-if="isWeb()"
        >
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-file-zipper']" />
          {{ $t(downloadZipText) }}
        </VFormButton>
        <VFormButton class="circle" @click="$emit('downloadAll')" v-else>
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-download']" />
          {{ $t(downloadFileText) }}
        </VFormButton>
        <VFormButton class="circle" @click="$emit('deleteAll')">
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']" />
          {{ $t(deleteText) }}
        </VFormButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scaled-image-list__ctrl {
  display: grid;
  gap: 1rem;
  align-items: center;

  &__display {
    flex-grow: 1;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0 1rem;

    &__all-checkbox {
      padding: 0 1rem;
    }

    &__buttons {
      display: flex;
      gap: 1rem;
    }
  }
}
</style>
