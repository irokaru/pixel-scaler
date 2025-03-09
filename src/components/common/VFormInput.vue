<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true,
  },
  type: {
    type: String,
    default: "text",
    validator: (val: string) => ["text", "number"].includes(val),
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  allowDecimal: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const inputValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  },
);

const validateAndEmit = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;

  if (props.type === "number") {
    if (!props.allowDecimal) {
      value = value.replace(/\..*/, "");
    }

    value = Number(value);
    if (!Number.isNaN(value)) {
      if (typeof props.min === "number" && value < props.min) value = props.min;
      if (typeof props.max === "number" && value > props.max) value = props.max;
    }
  } else {
    if (typeof props.min === "number" && value.length < props.min)
      value = value.padEnd(props.min, "");
    if (typeof props.max === "number" && value.length > props.max)
      value = value.slice(0, props.max);
  }

  inputValue.value = value;
  emit("update:modelValue", value);
};
</script>

<template>
  <input v-model="inputValue" :type="type" @input="validateAndEmit" />
</template>
