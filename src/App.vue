<script setup lang="ts">
import { ref } from "vue";

import ConvertSection from "@/components/convert/ConvertSection.vue";
import HowToUseSection from "@/components/HowToUseSection.vue";
import MainHeader from "@/components/MainHeader.vue";
import SettingsSection from "@/components/settings/SettingsSection.vue";

import { CustomErrorObject } from "./@types/error";
import InputErrorList from "./components/InputErrorList.vue";

const errors = ref<CustomErrorObject[]>([]);

const onDelete = (index: number) => {
  errors.value.splice(index, 1);
};
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <MainHeader />

      <main>
        <InputErrorList
          id="input-error-list"
          :errors="errors"
          @delete="onDelete"
        />

        <ConvertSection id="convert" v-model:errors="errors" />

        <HowToUseSection id="how-to-use" />

        <SettingsSection id="settings" />
      </main>

      <footer>&copy; {{ new Date().getFullYear() }} ののの茶屋.</footer>
    </div>
  </div>
</template>
