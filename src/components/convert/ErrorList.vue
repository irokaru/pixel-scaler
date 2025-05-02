<script setup lang="ts">
import { CustomErrorObject } from "@/@types/error";

import VClosableItem from "../common/VClosableItem.vue";

type Props = {
  errors: CustomErrorObject[];
};

type Emits = {
  close: [index: number];
};

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <div>
    <VClosableItem
      v-for="(error, index) in errors"
      @close="$emit('close', index)"
    >
      {{ error }}
    </VClosableItem>
  </div>
</template>
