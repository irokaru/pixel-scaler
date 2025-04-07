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

<style lang="scss" scoped>
.select-wrapper {
  position: relative;

  select {
    font-size: 1rem;
    cursor: pointer;
    appearance: none;
    background-color: var(--background);
    border-radius: 2rem;
    padding: 0.625rem;
    padding-right: 1.74rem;
    box-shadow:
      var(--edge-shadow) -2px -2px 4px 0px,
      var(--edge-bright) 2px 2px 4px 0px;
    transition: box-shadow 0.15s;
    border: none;
    text-overflow: ellipsis;

    &:focus {
      outline: none;
    }

    option {
      background-color: var(--background);
    }
  }

  &::before {
    position: absolute;
    top: 1rem;
    right: 0.74rem;
    width: 0;
    height: 0;
    border-width: 10px 5px 0 5px;
    border-style: solid;
    border-color: var(--scrollbar-shadow) transparent transparent transparent;
    content: "";
    pointer-events: none;
  }
}
</style>
