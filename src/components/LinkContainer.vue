<template>
  <div>
    <a :href="link.url" target="_blank" class="box circle margin-lr-1 hover active"
       v-for="link in links" :key="link.url">
      <v-fa :icon="link.icon"/> {{link.text}}
    </a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          url: 'https://bit.ly/2IOgFa3',
          icon: ['fas', 'share-alt-square'],
          text: '共有',
        },
        {
          url: 'https://twitter.com/irokaru',
          icon: ['fab', 'twitter'],
          text: '作った人',
        },
        {
          url: 'https://github.com/irokaru/pixel-scaler',
          icon: ['fab', 'github'],
          text: 'リポジトリ',
        },
        {
          url: 'https://nononotyaya.booth.pm/items/2517679',
          icon: ['fas', 'images'],
          text: 'Booth',
        },
      ],
    };
  },
}
</script>
