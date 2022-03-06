<template>
<div class="colors margin-tb-2">
  <div :style="{'background-color': color.background}" class="color-box box circle margin-1 hover active pointer" v-for="color in colors" :key="color" @click="click(color)">
  </div>
</div>
</template>

<script>
import colors from '../colors/color';

export default {
  emits: ['color'],
  data() {
    return {
      colors: colors,
    };
  },
  methods: {
    click(color) {
      this.$emit('color', color);
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
