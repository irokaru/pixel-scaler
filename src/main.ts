import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createGtag } from "vue-gtag";

import "@/assets/global.scss";

import { FontAwesomeIcons } from "@/constants/icon";
import { vueI18n } from "@/core/plugins/i18n";
import metaPlugin from "@/core/plugins/meta";

import App from "./App.vue";
import { isWeb } from "./core/system";

library.add(...Object.values(FontAwesomeIcons));

const app = createApp(App);
const pinia = createPinia();

app.component("FontAwesomeIcon", FontAwesomeIcon);
app.use(vueI18n);
app.use(metaPlugin);
app.use(pinia);
if (isWeb()) {
  const gtag = createGtag({ tagId: "G-1KZRGEYWQ7" });
  app.use(gtag);
}

app.mount("#app");
