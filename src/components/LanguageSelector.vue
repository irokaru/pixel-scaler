<script setup lang="ts">
import useI18n, { i18nLocales } from "@/composables/useI18n";

const { languageKey, languageKeys } = useI18n();

const handleClick = (i18nKey: i18nLocales) => (languageKey.value = i18nKey);
</script>

<template>
  <div id="languages" class="margin-tb-2">
    <div
      v-for="language in languageKeys"
      :key="language"
      class="box circle margin-1 hover active pointer"
      @click="handleClick(language)"
    >
      {{ language }}
    </div>
  </div>
</template>
