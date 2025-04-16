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

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5em;

  label {
    display: inline-block;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  input[type="checkbox"] {
    appearance: none;
    width: 2em;
    height: 2em;
    min-width: 2em;
    border-radius: 0.5em;
    background: var(--background);
    cursor: pointer;
    transition: 0.3s;
    position: relative;
    margin: 0;
    padding: 0;

    &:checked {
      background: #3498db;
    }

    &:checked::after {
      content: "\2714";
      font-size: 1.25em;
      color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
    }
  }
}
</style>
