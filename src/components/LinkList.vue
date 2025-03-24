<script lang="ts" setup>
import { links } from "@/constants/link";
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
      <FontAwesomeIcon :icon="link.icon" /> <span>{{ $t(link.textKey) }}</span>
    </a>
  </div>
</template>

<style src="../assets/components/LinkList.scss" scoped></style>
