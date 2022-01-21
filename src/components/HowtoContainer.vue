<template>
  <h2>{{$t('whatis')}}</h2>

  <p v-html="$t('whatis-detail')"></p>

  <h2 class="margin-t-2">{{$t('usage')}}</h2>
  <ol>
    <li v-for="num in usageNum" :key="num" v-html="$t(`usage-step-${num}`)"></li>
  </ol>

  <h2 class="margin-t-2">{{$t('tips')}}</h2>
  <ul>
    <li v-for="num in tipsNum" :key="num">{{$t(`tips-${num}`)}}</li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      usageNum: ['01', '02', '03', '04', '05', '06'],
      tipsNum: ['01', '02', '03'],
    };
  },
}
</script>
