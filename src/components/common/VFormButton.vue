<script setup lang="ts">
const emit = defineEmits(["click"]);
</script>

<template>
  <div class="v-form-button box hover active pointer" @click="emit('click')">
    <slot />
  </div>
</template>
