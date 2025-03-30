<script lang="ts" setup>
import VFormInput from "@/components/common/VFormInput.vue";
import VFormRadio from "@/components/common/VFormRadio.vue";
import VHintBalloon from "@/components/common/VHintBalloon.vue";
import {
  ScaleSizePercent,
  ScaleModes,
  OriginalPixelSize,
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
          :allow-decimal="false"
          :min="OriginalPixelSize.Min"
          :max="OriginalPixelSize.Max"
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
        <VFormInput
          v-model="scaleSizePercent"
          name="scale-size-percent"
          type="number"
          :allow-decimal="false"
          :min="ScaleSizePercent.Min"
          :max="ScaleSizePercent.Max"
        />
      </div>
    </div>
  </section>
</template>
