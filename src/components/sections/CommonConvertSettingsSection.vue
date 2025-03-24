<script lang="ts" setup>
import VFormInput from "@/components/common/VFormInput.vue";
import VFormRadio from "@/components/common/VFormRadio.vue";
import VHintBalloon from "@/components/common/VHintBalloon.vue";
import {
  ScaleSizePercentMax,
  ScaleSizePercentMin,
  ScaleModes,
  OriginalPixelSizeMin,
  OriginalPixelSizeMax,
} from "@/constants/form";
import { FontAwesomeIcons } from "@/constants/icon";

const originalPixelSize = defineModel<number>("originalPixelSize", {
  required: true,
});
const scaleMode = defineModel<string>("scaleMode", { required: true });
const scaleSizePercent = defineModel<number>("scaleSizePercent", {
  required: true,
});
</script>

<template>
  <section>
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
          <FontAwesomeIcon :icon="FontAwesomeIcons['fa-magnifying-glass']" />
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
  </section>
</template>
