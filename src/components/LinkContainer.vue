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
          url: 'https://bit.ly/3rCWXR0',
          icon: ['fas', 'share-alt-square'],
          text: this.$t('link-share-on-twitter'),
        },
        {
          url: 'https://twitter.com/irokaru',
          icon: ['fab', 'twitter'],
          text: this.$t('link-developer'),
        },
        {
          url: 'https://github.com/irokaru/pixel-scaler',
          icon: ['fab', 'github'],
          text: this.$t('link-repository'),
        },
        {
          url: 'https://nononotyaya.booth.pm/items/2517679',
          icon: ['fas', 'images'],
          text: this.$t('link-booth'),
        },
      ],
    };
  },
}
</script>
