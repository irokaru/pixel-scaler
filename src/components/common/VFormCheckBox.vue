<script lang="ts" setup>
type Props = {
  name: string;
  label: string;
  disabled?: boolean;
};

const modelValue = defineModel<boolean>({ required: true });
defineProps<Props>();

const toggleCheck = () => {
  modelValue.value = !modelValue.value;
};
</script>

<template>
  <div class="checkbox">
    <input
      class="box hover"
      type="checkbox"
      :name="name"
      :disabled="disabled"
      v-model="modelValue"
    />
    <label :for="name" @click="toggleCheck">
      {{ label }}
    </label>
  </div>
</template>
