<script setup lang="ts">
import { computed } from "vue";

import { CustomErrorObject, ErrorKind } from "@/@types/error";
import { FontAwesomeIcons } from "@/constants/icon";

import VFormButton from "./common/form/VFormButton.vue";
import VAccordionContent from "./common/VAccordionContent.vue";
import VClosableItem from "./common/VClosableItem.vue";

type Props = {
  errors: CustomErrorObject[];
  kinds: ErrorKind[];
};

type Emits = {
  deleteOneError: [uuid: string];
  deleteAllErrors: [];
};

const { errors, kinds } = defineProps<Props>();
defineEmits<Emits>();

const filteredErrors = computed(() => {
  return errors.filter((error) => kinds.includes(error.kind));
});
</script>

<template>
  <VAccordionContent
    class="input-error-list block"
    v-if="filteredErrors.length > 0"
  >
    <template #header>
      <div class="input-error-list__header">
        <div class="input-error-list__header-title">
          {{ $t("error.heading", { count: filteredErrors.length }) }}
        </div>
        <div class="input-error-list__header-button">
          <VFormButton @click="$emit('deleteAllErrors')" :title="$t('delete')"
            ><FontAwesomeIcon :icon="FontAwesomeIcons['fa-trash']"
          /></VFormButton>
        </div>
      </div>
    </template>
    <template #body>
      <VClosableItem
        v-for="error of filteredErrors"
        :key="error.uuid"
        class="input-error-list__item block"
        @close="$emit('deleteOneError', error.uuid)"
      >
        {{ $t(error.code, error.params) }}
      </VClosableItem>
    </template>
  </VAccordionContent>
</template>

<style lang="scss">
.input-error-list {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-button {
      font-size: 0.8rem;

      .v-form-button {
        padding: 0.666rem;
      }
    }
  }
}

.input-error-list__item {
  margin: 0 0.5rem 0.5rem 0.5rem;
}
</style>
