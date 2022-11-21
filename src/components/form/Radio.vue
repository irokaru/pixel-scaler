<template>
<div>
  <label v-for="(value, key) in options" :key="key" class="radio box active hover" :class="[isChecked(key) ? 'checked' : '']">
    <input type="radio" :name="name" :value="key" :checked="isChecked(key)" @change="onChange">{{trans ? $t(value) : value}}
  </label>
</div>
</template>

<script>

/**
 * @emits name form name
 * @emits modelValue v-model
 * @emits options {key: value} object
 */
export default {
  name: 'formSelect',
  props: {
    name       : {type: String,           required: true},
    modelValue : {type: [String, Number], required: true},
    trans      : {type: Boolean,          required: false, default: false},
    options    : {type: Object,           required: true},
  },
  methods: {
    /**
     * 入力時に発火させるやつ
     * @returns {void}
     */
    onChange(e) {
      const value = e.target.value;
      this.$emit('update:modelValue', value);
    },

    /**
     * チェックされているものか
     * @param {string|number} key
     * @returns {boolean}
     */
    isChecked(key) {
      return this.modelValue == key;
    }
  },
};
</script>
