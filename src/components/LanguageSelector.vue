<script lang="ts" setup>
import useI18n from "@/composables/useI18n";
import { vueI18nLocales } from "@/core/plugins/i18n";

const { languageKey, languageKeys } = useI18n();

const handleClick = (i18nKey: vueI18nLocales) => (languageKey.value = i18nKey);
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
