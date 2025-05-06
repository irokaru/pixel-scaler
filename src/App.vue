<script setup lang="ts">
import ConvertSection from "@/components/convert/ConvertSection.vue";
import HowToUseSection from "@/components/HowToUseSection.vue";
import MainHeader from "@/components/MainHeader.vue";
import SettingsSection from "@/components/settings/SettingsSection.vue";

import InputErrorList from "./components/InputErrorList.vue";
import useGlobalError from "./composables/useGlobalError";

const { GlobalErrors, deleteOneError } = useGlobalError();
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <MainHeader />

      <main>
        <InputErrorList
          id="input-error-list"
          :kinds="['file', 'input', 'unknown']"
          :errors="GlobalErrors"
          @delete-one-error="deleteOneError"
        />

        <ConvertSection id="convert" />

        <HowToUseSection id="how-to-use" />

        <SettingsSection id="settings" />
      </main>

      <footer>&copy; {{ new Date().getFullYear() }} ののの茶屋.</footer>
    </div>
  </div>
</template>
