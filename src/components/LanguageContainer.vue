<template>
<div class="languages">
  <div class="box circle margin-1 pointer hover active" v-for="lang in langs" :key="lang" @click="click(lang)">
    {{lang}}
  </div>
</div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      langs: ['ja', 'en', 'es'],
    };
  },
  methods: {
    click(lang) {
      this.$emit('update:modelValue', lang);
    }
  }
}
</script>
