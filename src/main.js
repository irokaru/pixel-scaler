import { createApp } from 'vue'
import App from './App.vue'

import { library }         from '@fortawesome/fontawesome-svg-core';
import { fas }             from '@fortawesome/free-solid-svg-icons';
import { far }             from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import "./assets/scss/global.scss";

// ---------------------------------------------------------------

library.add(fas, far);

const app = createApp(App);

app.component('v-fa', FontAwesomeIcon);

app.mount('#app');
