<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  name: { type: String, required: true },
  label: { type: String, required: true },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const isChecked = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    isChecked.value = newVal;
  },
);

const toggleCheck = () => {
  if (props.disabled) return;
  isChecked.value = !isChecked.value;
  emit("update:modelValue", isChecked.value);
};
</script>

<template>
  <div class="checkbox">
    <input
      class="box hover"
      type="checkbox"
      :name="name"
      :disabled="disabled"
      :checked="isChecked"
      @change="toggleCheck"
    />
    <label :for="name" @click="toggleCheck">
      {{ label }}
    </label>
  </div>
</template>
