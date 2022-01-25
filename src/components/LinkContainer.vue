<template>
  <div>
    <a :href="link.url" target="_blank" class="box circle margin-1 hover active"
       v-for="link in links" :key="link.url">
      <v-fa :icon="link.icon"/> {{$t(link.text)}}
    </a>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          url: 'https://bit.ly/3rMhwKT',
          icon: ['fas', 'share-alt-square'],
          text: 'link-share-on-twitter',
        },
        {
          url: 'https://twitter.com/irokaru',
          icon: ['fab', 'twitter'],
          text: 'link-developer',
        },
        {
          url: 'https://github.com/irokaru/pixel-scaler',
          icon: ['fab', 'github'],
          text: 'link-repository',
        },
        {
          url: 'https://nononotyaya.booth.pm/items/2517679',
          icon: ['fas', 'images'],
          text: 'link-booth',
        },
        {
          url: './oss-licenses.json',
          icon: ['fas', 'balance-scale'],
          text: 'link-license',
        }
      ],
    };
  },
}
</script>
