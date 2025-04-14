import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createApp } from "vue";
import "@/assets/global.scss";

import { FontAwesomeIcons } from "@/constants/icon";
import { vueI18n } from "@/core/plugins/i18n";
import metaPlugin from "@/core/plugins/meta";

import App from "./App.vue";

library.add(...Object.values(FontAwesomeIcons));

const app = createApp(App);

app.component("FontAwesomeIcon", FontAwesomeIcon);
app.use(vueI18n);
app.use(metaPlugin);

app.mount("#app");
