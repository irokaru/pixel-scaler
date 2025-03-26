<script lang="ts" setup>
type ModelValue = string | number;
type Option = {
  label: string;
  value: ModelValue;
};
type Props = {
  name: string;
  enableI18n?: boolean;
  options: Option[] | Readonly<Option[]>;
};

const modelValue = defineModel<ModelValue>({ required: true });
defineProps<Props>();

const handleChanged = (value: ModelValue) => (modelValue.value = value);
const isCheck = (value: ModelValue) => modelValue.value === value;
</script>

<template>
  <div class="radio-group">
    <label
      v-for="({ label, value }, index) in options"
      :key="index"
      class="radio box active hover"
      :class="{ checked: isCheck(value) }"
    >
      <input
        type="radio"
        :name="name"
        :value="value"
        :checked="isCheck(value)"
        @change="handleChanged(value)"
      />
      <span>{{ enableI18n ? $t(label) : label }}</span>
    </label>
  </div>
</template>
