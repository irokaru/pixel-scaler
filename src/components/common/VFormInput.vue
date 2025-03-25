<script lang="ts" setup>
import { ref } from "vue";

type Props = {
  type: "text" | "number";
  min: number;
  max: number;
  allowDecimal?: boolean;
};
type ModelValue = string | number;

const props = withDefaults(defineProps<Props>(), {
  allowDecimal: true,
});

const modelValue = defineModel<ModelValue>({ required: true });
const localValue = ref<ModelValue>(modelValue.value);

const toNumber = (value: ModelValue): number => {
  console.log(typeof value);
  if (value === "") {
    return props.min;
  }

  value = Number(value);

  if (!props.allowDecimal) {
    value = Math.trunc(value);
  }

  return Math.max(props.min, Math.min(props.max, value));
};

const toString = (value: ModelValue): string => {
  value = value.toString();
  if (value.length < props.min) value = value.padEnd(props.min, "");
  if (value.length > props.max) value = value.slice(0, props.max);
  return value;
};

const convertMethods = {
  number: toNumber,
  text: toString,
} satisfies Record<Props["type"], (value: ModelValue) => number | string>;

const validateAndEmit = () => {
  localValue.value = convertMethods[props.type](localValue.value);
  modelValue.value = localValue.value;
};
</script>

<template>
  <input v-model="localValue" :type="type" @input="validateAndEmit" />
</template>
