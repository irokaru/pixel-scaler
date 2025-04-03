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

import VAccordionContent from "../common/VAccordionContent.vue";
import VFormButton from "../common/VFormButton.vue";

const originalPixelSize = defineModel<number>("originalPixelSize", {
  required: true,
});
const scaleMode = defineModel<string>("scaleMode", { required: true });
const scaleSizePercent = defineModel<number>("scaleSizePercent", {
  required: true,
});

const emit = defineEmits(["apply"]);
</script>

<template>
  <section>
    <VAccordionContent class="margin-b-1">
      <template v-slot:header>共通設定</template>
      <template v-slot:body>
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
              <FontAwesomeIcon
                :icon="FontAwesomeIcons['fa-magnifying-glass']"
              />
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

          <div class="col">
            <VFormButton @click="emit('apply')">適用</VFormButton>
          </div>
        </div>
      </template>
    </VAccordionContent>
  </section>
</template>
