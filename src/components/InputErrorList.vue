<script setup lang="ts">
import { CustomErrorObject } from "@/@types/error";

import VClosableItem from "./common/VClosableItem.vue";

type Props = {
  errors: CustomErrorObject[];
};

type Emits = {
  delete: [uuid: string];
};

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <div>
    <div v-for="error of errors" :key="error.uuid">
      <VClosableItem
        v-if="['input', 'file'].includes(error.kind)"
        @close="$emit('delete', error.uuid)"
      >
        {{ $t(error.code, error.params) }}
      </VClosableItem>
    </div>
  </div>
</template>
