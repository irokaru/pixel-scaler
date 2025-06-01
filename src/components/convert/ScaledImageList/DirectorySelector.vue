<script setup lang="ts">
// NOTE: this component must bet used in a Tauri application.

import { storeToRefs } from "pinia";

import useOutputPathStore from "@/stores/outputPathStore";

import VFormButton from "../../common/form/VFormButton.vue";
import VFormInput from "../../common/form/VFormInput.vue";

const outputPathStore = useOutputPathStore();
const { outputPath, error, hasError } = storeToRefs(outputPathStore);
const { browseDir } = outputPathStore;
</script>

<template>
  <div class="directory-selector">
    <div class="directory-selector__input">
      <label for="outputPath">
        <span>{{ $t("path-selector.output-path") }}</span>
        <VFormInput
          id="outputPath"
          name="outputPath"
          v-model="outputPath"
          type="text"
          :min="0"
          :max="Number.MAX_VALUE"
        />
      </label>
      <VFormButton class="circle" @click="browseDir">{{
        $t("path-selector.select-path")
      }}</VFormButton>
    </div>
    <div class="directory-selector__warning" v-if="hasError">
      {{ $t(error) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.directory-selector {
  &__input {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    span {
      gap: 0.5rem;
    }
    input {
      border-radius: 1rem 0.25rem 0.25rem 1rem;
    }

    .v-form-button {
      padding: 0.75rem;
      border-radius: 0.25rem 1rem 1rem 0.25rem;
    }
  }
}
</style>
