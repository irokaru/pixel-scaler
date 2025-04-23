<script setup lang="ts">
import { computed } from "vue";

import { ResultDisplayStyleType } from "@/@types/form";
import VFormButton from "@/components/common/VFormButton.vue";
import VFormRadio from "@/components/common/VFormRadio.vue";
import useI18nTextKey from "@/composables/useI18nTextKey";
import { ResultDisplayStyleOptions } from "@/constants/form";
import { isWeb } from "@/core/system";

type Props = {
  isAnyChecked: boolean;
  onClickDownloadZip: () => void;
  onClickDownloadAll: () => void;
  onClickDeleteAll: () => void;
};

const displayStyle = defineModel<ResultDisplayStyleType>("displayStyle", {
  required: true,
  default: "grid",
});
const { isAnyChecked } = defineProps<Props>();
const isAnyCheckedRef = computed(() => isAnyChecked);
const { deleteText, downloadZipText, downloadFileText } =
  useI18nTextKey(isAnyCheckedRef);
</script>

<template>
  <div class="scaled-image-list__ctrl padding-tb-1">
    <div class="scaled-image-list__ctrl__display">
      <VFormRadio
        name="displayStyle"
        v-model="displayStyle"
        :options="ResultDisplayStyleOptions"
        :enable-i18n="true"
      />
    </div>
    <div class="scaled-image-list__ctrl__buttons">
      <VFormButton class="circle" @click="onClickDownloadZip" v-if="isWeb()">
        {{ $t(downloadZipText) }}
      </VFormButton>
      <VFormButton class="circle" @click="onClickDownloadAll" v-else>
        {{ $t(downloadFileText) }}
      </VFormButton>
      <VFormButton class="circle" @click="onClickDeleteAll">
        {{ $t(deleteText) }}
      </VFormButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scaled-image-list__ctrl {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__display {
    flex-grow: 1;
  }

  &__buttons {
    display: flex;
    gap: 0 1rem;
  }
}
</style>
