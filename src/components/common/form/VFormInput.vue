<script setup lang="ts">
import { ref, watch } from "vue";

type Properties = {
  type: "text" | "number";
  min: number;
  max: number;
  allowDecimal?: boolean;
};
type ModelValue = string | number;

const properties = withDefaults(defineProps<Properties>(), {
  allowDecimal: true,
});

const modelValue = defineModel<ModelValue>({ required: true });
const localValue = ref<ModelValue>(modelValue.value);

const toNumber = (value: ModelValue): number => {
  if (value === "") {
    return properties.min;
  }

  value = Number(value);

  if (!properties.allowDecimal) {
    value = Math.trunc(value);
  }

  return Math.max(properties.min, Math.min(properties.max, value));
};

const toString = (value: ModelValue): string => {
  value = value.toString();
  if (value.length < properties.min) value = value.padEnd(properties.min, "");
  if (value.length > properties.max) value = value.slice(0, properties.max);
  return value;
};

const convertMethods = {
  number: toNumber,
  text: toString,
} satisfies Record<Properties["type"], (value: ModelValue) => number | string>;

const validateAndEmit = () => {
  localValue.value = convertMethods[properties.type](localValue.value);
  modelValue.value = localValue.value;
};

watch(modelValue, (newValue) => {
  localValue.value = newValue;
});
</script>

<template>
  <input
    v-model="localValue"
    :type="type"
    :min="min"
    :max="max"
    @blur="validateAndEmit"
    @keyup.enter="validateAndEmit"
  />
</template>

<style lang="scss" scoped>
input[type="number"],
input[type="text"] {
  user-select: text;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0);
  padding: 0.625em;
  border-radius: 2em;
  box-shadow:
    var(--edge-shadow) -2px -2px 4px 0px,
    var(--edge-bright) 2px 2px 4px 0px;
  transition: box-shadow 0.15s;
  border: none;

  &:focus {
    outline: none;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    opacity: 1;
  }
}
</style>
