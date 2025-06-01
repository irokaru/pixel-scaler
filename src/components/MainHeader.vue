<script setup lang="ts">
import { isUnite } from "@/core/system";
</script>

<template>
  <header>
    <h1 v-if="isUnite()">
      <img
        src="/banner.png"
        :alt="$t('title')"
        onselectstart="return false;"
        onmousedown="return false;"
        oncontextmenu="return false;"
      />
    </h1>
    <h1 v-else>{{ $t("title") }}</h1>
  </header>
</template>
