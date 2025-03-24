<script lang="ts" setup>
type Props = {
  type: "text" | "number";
  min: number;
  max: number;
  allowDecimal?: boolean;
};

const modelValue = defineModel<string | number>();

const props = withDefaults(defineProps<Props>(), {
  allowDecimal: true,
});

const validateAndEmit = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: string | number = target.value;

  if (modelValue.value === "") return;

  console.log(value);
  if (props.type === "number") {
    if (!props.allowDecimal) {
      value = String(value).replaceAll(/\./, "");
    }

    if (!Number.isNaN(value)) {
      if (!Number.isNaN(Number(value))) value = Number(value);
      if (!Number.isNaN(Number(modelValue.value)))
        modelValue.value = Number(modelValue.value);
    }

    if (typeof value === "number") {
      if (!props.allowDecimal) value = Math.trunc(value);
      if (value < props.min) value = props.min;
      if (value > props.max) value = props.max;
    }
  } else {
    if (typeof props.min === "number" && value.length < props.min)
      value = value.padEnd(props.min, "");
    if (typeof props.max === "number" && value.length > props.max)
      value = value.slice(0, props.max);
  }

  modelValue.value = value;
};
</script>

<template>
  <input v-model="modelValue" :type="type" @input="validateAndEmit" />
</template>
