<script lang="ts" setup>
import { computed, ref, watch } from "vue";

import { ImageEntry } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";
import useImageEntrySettings from "@/composables/useImageEntrySettings";

import InputFileListItemHeader from "./Header.vue";
import InputFileListItem from "./Item.vue";

const modelValue = defineModel<ImageEntry[]>({ required: true, default: [] });
const originalPixelSize = defineModel<number>("originalPixelSize", {
  required: true,
});
const scaleMode = defineModel<ScaleModeType>("scaleMode", { required: true });
const scaleSizePercent = defineModel<number>("scaleSizePercent", {
  required: true,
});

const { applySettingsToImageEntryList } = useImageEntrySettings(modelValue);

const checkedMap = ref<Record<string, boolean>>({});
const allChecked = computed({
  get: () =>
    modelValue.value.every((item) => checkedMap.value[item.image.uuid]),
  set: (val: boolean) => {
    for (const item of modelValue.value) {
      checkedMap.value[item.image.uuid] = val;
    }
  },
});

const emits = defineEmits<{
  convert: [value: number];
  delete: [value: number];
}>();

const toggleAllChecked = () => {
  allChecked.value = !allChecked.value;
};

const handleApply = () => {
  applySettingsToImageEntryList(
    scaleSizePercent.value,
    originalPixelSize.value,
    scaleMode.value,
  );
};

watch(
  modelValue,
  (newList) => {
    for (const item of newList) {
      if (!(item.image.uuid in checkedMap.value)) {
        checkedMap.value[item.image.uuid] = false;
      }
    }

    const uuids = new Set(newList.map((item) => item.image.uuid));
    for (const uuid of Object.keys(checkedMap.value)) {
      if (!uuids.has(uuid)) {
        delete checkedMap.value[uuid];
      }
    }
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <div data-testid="input-file-list">
    <InputFileListItemHeader
      v-model="allChecked"
      v-model:original-pixel-size="originalPixelSize"
      v-model:scale-mode="scaleMode"
      v-model:scale-size-percent="scaleSizePercent"
      @click="toggleAllChecked"
      @apply="handleApply"
    />
    <hr />
    <div class="input-file-list">
      <InputFileListItem
        v-for="(_, index) in modelValue"
        :key="index"
        v-model="modelValue[index]"
        v-model:checked="checkedMap[modelValue[index].image.uuid]"
        :index="index"
        @convert="emits('convert', index)"
        @delete="emits('delete', index)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../assets/variables.scss";

.input-file-list {
  height: 30vh;
  overflow-y: scroll;
  // NOTE: for hidden checkbox box-shadow
  padding: 0 1rem;
  margin: 0 -1rem;
  padding-right: 0.3rem;
  margin-right: -0.633rem;

  &::-webkit-scrollbar {
    width: 0.333rem;
  }

  @media (max-height: variables.$tablet-height) {
    height: 60vh;
  }
}
</style>
