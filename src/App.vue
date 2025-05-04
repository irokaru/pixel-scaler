<script setup lang="ts">
import { ref } from "vue";

import ConvertSection from "@/components/convert/ConvertSection.vue";
import HowToUseSection from "@/components/HowToUseSection.vue";
import MainHeader from "@/components/MainHeader.vue";
import SettingsSection from "@/components/settings/SettingsSection.vue";

import { CustomErrorObject } from "./@types/error";
import InputErrorList from "./components/InputErrorList.vue";

const globalErrors = ref<CustomErrorObject[]>([]);

const onDelete = (uuid: string) => {
  globalErrors.value = globalErrors.value.filter(
    (error) => error.uuid !== uuid,
  );
};
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <MainHeader />

      <main>
        <InputErrorList
          id="input-error-list"
          :kind="['file', 'input', 'unknown']"
          :errors="globalErrors"
          @delete="onDelete"
        />

        <ConvertSection
          id="convert"
          v-model:errors="globalErrors"
          @delete-one-error="onDelete"
        />

        <HowToUseSection id="how-to-use" />

        <SettingsSection id="settings" />
      </main>

      <footer>&copy; {{ new Date().getFullYear() }} ののの茶屋.</footer>
    </div>
  </div>
</template>
