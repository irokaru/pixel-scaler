<template>
<div class="box block margin-tb-2" @click="$emit('close')" v-if="attentions.length">
  <v-fa icon="times-circle" class="close-btn pointer" @click="$emit('close')"/>
  <h2>{{$t('attention')}}</h2>
  <ul>
    <li v-for="attention in attentions" :key="attention">{{$t(attention)}}</li>
  </ul>
</div>

</template>

<script>
export default {
  data() {
    return {
      attentions: [],
    }
  },
  emits: ['close'],
}
</script>
