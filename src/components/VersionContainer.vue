<template>
<div class="box block margin-tb-4">
  <v-fa icon="times-circle" class="close-btn pointer" @click="$emit('close')"/>

  <template v-if="!checkUpdate">
    <p>アップデート確認中…</p>
  </template>

  <template v-else-if="isLatest">
    <p>最新バージョン {{latestVersion}} がリリースされています。</p>
    <p>ダウンロードは<a href="https://nononotyaya.booth.pm/items/2517679" target="_blank">コチラ</a>から！</p>
  </template>

  <template v-else>
    <p>お使いのバージョンは最新版です</p>
  </template>

</div>
</template>

<script>
export default {
  props: {
    checkUpdate: {
      type    : Boolean,
      required: true,
    },
    isLatest: {
      type    : Boolean,
      required: true
    },
    latestVersion: {
      type    : String,
      required: true,
    }
  },
  emits: ['close'],
}
</script>
