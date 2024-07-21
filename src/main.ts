import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createApp } from "vue";

import App from "./App.vue";
import { vueI18n } from "./controllers/i18nController";
import { FontAwesomeIcons } from "./static/icon";

library.add(...Object.values(FontAwesomeIcons));

const app = createApp(App);

app.component("FontAwesomeIcon", FontAwesomeIcon);
app.use(vueI18n);

app.mount("#app");
