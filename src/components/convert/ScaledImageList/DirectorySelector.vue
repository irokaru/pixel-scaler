<script setup lang="ts">
// NOTE: this component must bet used in a Tauri application.

import usePathSelector from "@/composables/usePathSelector";

import VFormButton from "../../common/form/VFormButton.vue";
import VFormInput from "../../common/form/VFormInput.vue";

const modelValue = defineModel<string>({
  required: true,
});
const { browseDir, error } = usePathSelector(modelValue);
</script>

<template>
  <div class="directory-selector">
    <div class="directory-selector__input">
      <label for="outputPath">
        <span>output</span>
        <VFormInput
          id="outputPath"
          name="outputPath"
          v-model="modelValue"
          type="text"
          :min="0"
          :max="Number.MAX_VALUE"
        />
      </label>
      <VFormButton class="circle" @click="browseDir">Browse</VFormButton>
    </div>
    <div class="directory-selector__warning" v-if="error">
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
