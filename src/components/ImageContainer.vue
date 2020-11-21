<template>
<div class="box-reverse block scroll">
  <div class="center">
    <img :src="toShowable(original)">

    <v-fa icon="arrow-down" class="margin-tb-2 big"/>

    <a :href="converted.base64" :download="converted.filename">
      <img :src="converted.base64">
    </a>
  </div>
</div>
</template>

<script>
import FileUtil from '../lib/FileUtil';

export default {
  props: {
    original: {
      type    : Object,
      required: true,
    },
    converted: {
      type    : Object,
      required: true,
    },
  },
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
