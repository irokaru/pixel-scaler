<template>
  <v-fa icon="times-circle" class="close-btn pointer" @click="$emit('close')"/>
  <p>エラーが発生しました。作った人に下記のテキストを送りつけてください。</p>
  <pre class="box-reverse block selectable-all">{{exception}}</pre>
</template>

<script>
export default {
  props: {
    exception: {
      required: true,
    },
  },
  emits: ['close'],
}
</script>
