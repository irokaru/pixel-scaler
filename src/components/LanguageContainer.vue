<template>
<div class="languages margin-tb-2">
  <div class="box circle margin-1 pointer hover active" v-for="lang in langs" :key="lang" @click="click(lang)">
    {{lang}}
  </div>
</div>
</template>

<script>
import {getLanguageNames} from '../i18n/lang';

export default {
  emits: ['lang'],
  data() {
    return {
      langs: getLanguageNames(),
    };
  },
  methods: {
    click(lang) {
      this.$emit('lang', lang);
    }
  }
}
</script>
