<script lang="ts" setup>
type ModelValue = string | number;
type Option = {
  label: string;
  value: ModelValue;
};
type Props = {
  name: string;
  options: Option[];
  enableI18n?: boolean;
};

defineProps<Props>();
const modelValue = defineModel<ModelValue>({ required: true });
</script>

<template>
  <div class="select-wrapper">
    <select :name="name" v-model="modelValue">
      <option
        v-for="{ label, value } in options"
        :key="value"
        :value="value"
        :selected="modelValue === value"
      >
        {{ enableI18n ? $t(label) : label }}
      </option>
    </select>
  </div>
</template>
