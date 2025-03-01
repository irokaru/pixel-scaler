<script setup lang="ts">
import { ConvertedFile } from "@/@types/convert";

const modelValue = defineModel<ConvertedFile[]>({
  default: [],
});
</script>

<template>
  <section>
    <div
      v-for="{ file, scaledSizePercent, scaledType } in modelValue"
      :key="file.data.name + scaledSizePercent + scaledType"
    >
      <!-- TODO: conversion results -->
      <h2>{{ file.data.name }}</h2>
      <img :src="file.url" :alt="file.data.name" />
    </div>
  </section>
</template>
