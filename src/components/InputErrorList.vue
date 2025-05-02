<script setup lang="ts">
import { CustomErrorObject } from "@/@types/error";

import VClosableItem from "./common/VClosableItem.vue";

type Props = {
  errors: CustomErrorObject[];
};

type Emits = {
  delete: [index: number];
};

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <div>
    <div v-for="(error, index) of errors" :key="index">
      <VClosableItem
        v-if="['input', 'file'].includes(error.kind)"
        @close="$emit('delete', index)"
      >
        {{ $t(error.code, error.params) }}
      </VClosableItem>
    </div>
  </div>
</template>
