<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import { ResultDisplayStyleType } from "@/@types/form";
import VFormButton from "@/components/common/form/VFormButton.vue";
import VFormCheckBox from "@/components/common/form/VFormCheckBox.vue";
import VFormRadio from "@/components/common/form/VFormRadio.vue";
import VFormDirectorySelector from "@/components/convert/ScaledImageList/DirectorySelector.vue";
import useI18nTextKey from "@/composables/useI18nTextKey";
import { ResultDisplayStyleOptions } from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";
import { isStandalone, isWeb } from "@/core/system";
import useOutputPathStore from "@/stores/outputPathStore";

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
const emits = defineEmits<Emits>();

const outputPathStore = useOutputPathStore();
const { hasError } = storeToRefs(outputPathStore);

const { isAnyChecked } = defineProps<Props>();
const isAnyCheckedRef = computed(() => isAnyChecked);
const { deleteText, downloadZipText, outputFileText } =
  useI18nTextKey(isAnyCheckedRef);

const isWebApp = isWeb();
const downloadButtonProps = computed(() => {
  return isWebApp
    ? {
        icon: FontAwesomeIcons["fa-file-zipper"],
        text: downloadZipText.value,
        click: () => emits("downloadZip"),
      }
    : {
        icon: FontAwesomeIcons["fa-download"],
        text: outputFileText.value,
        click: () => emits("downloadAll"),
      };
});
</script>

<template>
  <div class="scaled-image-list__ctrl padding-t-1">
    <div class="scaled-image-list__ctrl__header">
      <div class="scaled-image-list__ctrl__display">
        <VFormRadio
          name="displayStyle"
          v-model="displayStyle"
          :options="ResultDisplayStyleOptions"
          :enable-i18n="true"
        />
      </div>
      <div v-if="isStandalone()">
        <VFormDirectorySelector />
      </div>
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
          @click="downloadButtonProps.click"
          :disabled="hasError"
        >
          <FontAwesomeIcon :icon="downloadButtonProps.icon" />
          {{ $t(downloadButtonProps.text) }}
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

  &__header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

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
