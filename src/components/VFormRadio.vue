<script lang="ts" setup>
interface OptionType {
  label: string;
  value: string;
}

interface Props {
  name: string;
  options: OptionType[];
  modelValue: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const handleChanged = (value: string) => emits("update:modelValue", value);
const isCheck = (value: string) => props.modelValue === value;
</script>

<template>
  <div class="radio-group">
    <label
      v-for="({ label, value }, index) in props.options"
      :key="index"
      class="radio box active hover"
      :class="{ checked: isCheck(value) }"
    >
      <input
        type="radio"
        :name="props.name"
        :value="value"
        :checked="isCheck(value)"
        @change="handleChanged(value)"
      />
      <span>{{ label }}</span>
    </label>
  </div>
</template>
