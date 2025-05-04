<script setup lang="ts">
import { computed } from "vue";

import { CustomErrorObject, ErrorKind } from "@/@types/error";

import VClosableItem from "./common/VClosableItem.vue";

type Props = {
  errors: CustomErrorObject[];
  kind: ErrorKind[];
};

type Emits = {
  delete: [uuid: string];
};

const { errors, kind } = defineProps<Props>();
defineEmits<Emits>();

const filteredErrors = computed(() => {
  return errors.filter((error) => kind.includes(error.kind));
});
</script>

<template>
  <div>
    <div v-for="error of filteredErrors" :key="error.uuid">
      <VClosableItem @close="$emit('delete', error.uuid)">
        {{ $t(error.code, error.params) }}
      </VClosableItem>
    </div>
  </div>
</template>
