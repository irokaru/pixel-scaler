<script lang="ts" setup>
import CommonConvertSettingsSection from "@/components/sections/CommonConvertSettingsSection.vue";
import ConvertSection from "@/components/sections/ConvertSection.vue";
import HowToUseSection from "@/components/sections/HowToUseSection.vue";
import SettingsSection from "@/components/sections/SettingsSection.vue";
import useScaleSettings from "@/composables/useScaleSettings";
import { isUnite } from "@/core/system";

const { originalPixelSize, scaleMode, scaleSizePercent } = useScaleSettings();
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

      <nav>
        <CommonConvertSettingsSection
          id="common-settings"
          v-model:original-pixel-size="originalPixelSize"
          v-model:scale-mode="scaleMode"
          v-model:scale-size-percent="scaleSizePercent"
        />
      </nav>

      <main>
        <ConvertSection
          id="convert"
          :original-pixel-size="originalPixelSize"
          :scale-mode="scaleMode"
          :scale-size-percent="scaleSizePercent"
        />

        <HowToUseSection id="how-to-use" />

        <SettingsSection id="settings" />
      </main>

      <footer>&copy; {{ new Date().getFullYear() }} ののの茶屋.</footer>
    </div>
  </div>
</template>
