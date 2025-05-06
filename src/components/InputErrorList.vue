<script setup lang="ts">
import { computed } from "vue";

import { CustomErrorObject, ErrorKind } from "@/@types/error";

import VAccordionContent from "./common/VAccordionContent.vue";
import VClosableItem from "./common/VClosableItem.vue";

type Props = {
  errors: CustomErrorObject[];
  kinds: ErrorKind[];
};

type Emits = {
  deleteOneError: [uuid: string];
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
    <template #header>{{
      $t("error.heading", { count: filteredErrors.length })
    }}</template>
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
.input-error-list__item {
  margin: 0 0.5rem 0.5rem 0.5rem;
}
</style>
