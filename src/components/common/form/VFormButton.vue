<script setup lang="ts">
type Props = {
  disabled?: boolean;
};
type Emits = {
  click: [];
};
defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <div
    class="v-form-button box hover active pointer"
    :class="{ disabled: disabled }"
    @click="$emit('click')"
    :disabled="disabled"
  >
    <slot />
  </div>
</template>
