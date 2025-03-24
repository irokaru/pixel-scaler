<script lang="ts" setup>
import { ref, watch } from "vue";

type Props = {
  type: "text" | "number";
  min: number;
  max: number;
  allowDecimal?: boolean;
};

const localValue = ref<string | number>("");
const modelValue = defineModel<string | number>();

const props = withDefaults(defineProps<Props>(), {
  allowDecimal: true,
});

watch(
  () => modelValue.value,
  (newValue) => {
    localValue.value = newValue ?? "";
  },
  { immediate: true },
);

const validateAndEmit = () => {
  if (props.type === "number") {
    if (localValue.value === "") {
      modelValue.value = props.min;
      localValue.value = props.min;
      return;
    }

    localValue.value = Number(localValue.value);

    if (props.allowDecimal) {
      localValue.value = Math.trunc(localValue.value);
    }

    localValue.value = Math.max(
      props.min,
      Math.min(props.max, localValue.value),
    );
  } else {
    localValue.value = localValue.value.toString();
    if (localValue.value.length < props.min)
      localValue.value = localValue.value.padEnd(props.min, "");
    if (localValue.value.length > props.max)
      localValue.value = localValue.value.slice(0, props.max);
  }
  modelValue.value = localValue.value;
};
</script>

<template>
  <input v-model="localValue" :type="type" @input="validateAndEmit" />
</template>
