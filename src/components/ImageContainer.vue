<template>
<div class="box image-box">
  <div class="image-name">{{converted.filename}}</div>

  <a class="box-reverse block image-wrapper" :href="converted.base64" :download="converted.filename">
    <img class="cover" :src="converted.base64">
  </a>

  <div class="btn-list">
    <div class="box circle pointer margin-1 hover active" @click="$emit('preview')">
      <v-fa :icon="['fas', 'search-plus']"/>
    </div>
    <a class="box circle margin-1 hover active" :href="converted.base64" :download="converted.filename">
      <v-fa :icon="['fas', 'download']"/>
    </a>
  </div>
</div>
</template>

<script>
import FileUtil from '../lib/FileUtil';

export default {
  props: {
    org: {
      type    : Object,
      required: true,
    },
    converted: {
      type    : Object,
      required: true,
    },
  },
  emits: ['preview'],
  methods: {
    /**
     * ファイルを表示できる形式にするやつ
     * @param {Blob} files
     * @returns {string}
     */
    toShowable(blob) {
      return FileUtil.toShowable(blob);
    },
  },
}
</script>

<style lang="scss" scoped>
.image-box {
  .image-name {
    text-align: center;
    margin-bottom: 1em;
  }
}
</style>
