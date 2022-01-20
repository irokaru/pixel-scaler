<template>
<div class="box block">
  <v-fa icon="times-circle" class="close-btn pointer" @click="$emit('close')"/>

  <template v-if="!checkUpdate">
    <p>{{$t('version-check')}}</p>
  </template>

  <template v-else-if="isLatest">
    <p>{{$t('version-new-notice', {version: latestVersion})}}</p>
    <p v-html="$t('version-new-download', {url: 'https://nononotyaya.booth.pm/items/2517679'})"></p>
  </template>

  <template v-else>
    <p>{{$t('version-latest-now')}}</p>
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
