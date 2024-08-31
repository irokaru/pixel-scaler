<script lang="ts" setup>
import ColorSelector from "../ColorSelector.vue";
import LanguageSelector from "../LanguageSelector.vue";
import LinkList from "../LinkList.vue";

const themeColorKeyModelValue = defineModel<string>("themeColorKey", {
  required: true,
});
</script>

<template>
  <section>
    <LanguageSelector />
    <ColorSelector v-model="themeColorKeyModelValue" />
    <LinkList />
  </section>
</template>
