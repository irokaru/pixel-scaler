<script setup lang="ts">
import VFormInput from "@/components/common/VFormInput.vue";
import VFormRadio from "@/components/common/VFormRadio.vue";
import VHintBalloon from "@/components/common/VHintBalloon.vue";
import ConvertSection from "@/components/sections/ConvertSection.vue";
import HowToUseSection from "@/components/sections/HowToUseSection.vue";
import SettingsSection from "@/components/sections/SettingsSection.vue";
import useScaleSettings from "@/composables/useScaleSettings";
import {
  ScaleSizePercentMax,
  ScaleSizePercentMin,
  ScaleModes,
  OriginalPixelSizeMin,
  OriginalPixelSizeMax,
} from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";
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
        <div class="row margin-b-1">
          <div class="col">
            <div class="top-label">
              <FontAwesomeIcon :icon="FontAwesomeIcons['fa-maximize']" />
              {{ $t("form.original-pixel-size") }}
              <VHintBalloon position="top">
                {{ $t("form.original-pixel-size-hint") }}
              </VHintBalloon>
            </div>
            <VFormInput
              v-model="originalPixelSize"
              name="original-pixel-size"
              type="number"
              inputmode="decimal"
              :min="OriginalPixelSizeMin"
              :max="OriginalPixelSizeMax"
            />
          </div>

          <div class="col">
            <div class="top-label">
              <FontAwesomeIcon :icon="FontAwesomeIcons['fa-terminal']" />
              {{ $t("form.scale-mode") }}
            </div>
            <VFormRadio
              v-model="scaleMode"
              name="scale-mode"
              :options="ScaleModes"
              :enable-i18n="true"
            />
          </div>

          <div class="col">
            <div class="top-label">
              <FontAwesomeIcon
                :icon="FontAwesomeIcons['fa-magnifying-glass']"
              />
              {{ $t("form.scale-size-percent") }}
            </div>
            <input
              v-model="scaleSizePercent"
              class="flex-grow-1"
              type="number"
              inputmode="decimal"
              :min="ScaleSizePercentMin"
              :max="ScaleSizePercentMax"
            />
          </div>
        </div>
      </nav>

      <main>
        <ConvertSection />

        <HowToUseSection id="how-to-use" />

        <SettingsSection id="settings" />
      </main>

      <footer>(C) {{ new Date().getFullYear() }} ののの茶屋.</footer>
    </div>
  </div>
</template>
