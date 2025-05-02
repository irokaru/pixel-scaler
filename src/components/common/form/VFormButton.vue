<script setup lang="ts">
type Emits = {
  click: [];
};
defineEmits<Emits>();
</script>

<template>
  <div class="v-form-button box hover active pointer" @click="$emit('click')">
    <slot />
  </div>
</template>
