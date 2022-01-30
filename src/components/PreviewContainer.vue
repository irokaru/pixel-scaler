<template>
<div class="preview-wrapper" @click="$emit('close')">
  <img :src="image">
</div>
</template>

<script>
export default {
  props: {
    image: {
      type    : String,
      required: true,
    },
  },
  emits: ['close'],
}
</script>

<style lang="scss" scoped>
.preview-wrapper {
  user-select: none;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .75);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
  }
}
</style>
