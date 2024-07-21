<script setup lang="ts">
import { links } from "@/static/link";
</script>

<template>
  <div>
    <a
      v-for="link in links"
      :key="link.url"
      :href="link.url"
      target="_blank"
      class="box circle margin-1 hover active"
    >
      <font-awesome-icon :icon="link.icon" /> {{ link.textKey }}
    </a>
  </div>
</template>

<style src="../assets/components/LinkList.scss" scoped></style>
