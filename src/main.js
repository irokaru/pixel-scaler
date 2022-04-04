import { createApp } from 'vue';
import App from './App.vue';

require('./lib/Polyfill');

import { library }         from '@fortawesome/fontawesome-svg-core';
import { fas }             from '@fortawesome/free-solid-svg-icons';
import { far }             from '@fortawesome/free-regular-svg-icons';
import { fab }             from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import VueGtag from 'vue-gtag';

import {i18n} from './settings/lang';
import { isWeb } from './lib/System';

// ---------------------------------------------------------------

library.add(fas, far, fab);

const app = createApp(App);

app.component('v-fa', FontAwesomeIcon);

app.use(i18n);

if (isWeb()) app.use(VueGtag, {config: {id: process.env.VUE_APP_GTAG}});

app.mount('#app');
