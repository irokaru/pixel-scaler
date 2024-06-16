<script lang="ts" setup>
interface OptionType {
  label: string;
  value: string | number;
}

interface Props {
  name: string;
  options: OptionType[];
}

const modelValue = defineModel<string | number>({ required: true });
const props = defineProps<Props>();

const handleChanged = (value: string | number) => (modelValue.value = value);
const isCheck = (value: string | number) => modelValue.value === value;
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
