<script setup lang="ts">
const modelValue = defineModel<ConvertedFile[]>({
  default: [],
});

const toShowable = (file: File) => {
  return window.URL.createObjectURL(new Blob([file], { type: file.type }));
};
</script>

<template>
  <section>
    <div
      v-for="{ file, scaledSizePercent, scaledType } in modelValue"
      :key="file.name + scaledSizePercent + scaledType"
    >
      <!-- TODO: conversion results -->
      <h2>{{ file.name }}</h2>
      <img :src="toShowable(file)" :alt="file.name" />
    </div>
  </section>
</template>
