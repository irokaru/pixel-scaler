<template>
  <v-fa icon="times-circle" class="close-btn pointer" @click="$emit('close')"/>
  <p>{{$t('exception')}}</p>
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
