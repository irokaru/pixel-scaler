<script setup lang="ts">
import { isWeb } from "@/core/infrastructure/app";

import ColorSelector from "./ColorSelector.vue";
import LanguageSelector from "./LanguageSelector.vue";
import LinkList from "./LinkList.vue";
</script>

<template>
  <section>
    <LanguageSelector />
    <ColorSelector />
    <LinkList v-if="isWeb()" />
  </section>
</template>
