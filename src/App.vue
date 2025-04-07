<script lang="ts" setup>
import ConvertSection from "@/components/sections/ConvertSection.vue";
import HowToUseSection from "@/components/sections/HowToUseSection.vue";
import SettingsSection from "@/components/sections/SettingsSection.vue";
import { isUnite } from "@/core/system";
</script>

<template>
  <div class="wrapper">
    <div class="container">
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

      <main>
        <ConvertSection id="convert" />

        <HowToUseSection id="how-to-use" />

        <SettingsSection id="settings" />
      </main>

      <footer>&copy; {{ new Date().getFullYear() }} ののの茶屋.</footer>
    </div>
  </div>
</template>
