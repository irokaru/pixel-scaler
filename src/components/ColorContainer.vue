<template>
<div class="colors margin-tb-2">
  <div :style="{'background-color': color.background}" class="color-box box circle margin-1 hover active pointer" v-for="(color, key) in colors" :key="key" @click="click(key, color)">
  </div>
</div>
</template>

<script>
import {colors} from '../colors/color';

export default {
  emits: ['color'],
  data() {
    return {
      colors: colors,
    };
  },
  methods: {
    click(name, color) {
      this.$emit('color', name, color);
    },
  },
}
</script>

<style lang="scss">
.colors {
  .color-box {
    width: 1rem;
    height: 1rem;
  }
}
</style>
