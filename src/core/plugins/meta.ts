import { watchEffect, Plugin } from "vue";

import { createOrChangeOgpValues } from "@/core/utils/ogp";

import { vueI18n } from "./i18n";

const metaPlugin = {
  install() {
    watchEffect(() => {
      document.title = vueI18n.global.t("title");
      createOrChangeOgpValues([
        { property: "og:title", content: vueI18n.global.t("title") },
        { property: "og:site_name", content: vueI18n.global.t("title") },
        {
          property: "og:description",
          content: vueI18n.global.t("ogp-description"),
        },
        { property: "og:locale", content: vueI18n.global.locale.value },
      ]);
    });
  },
} satisfies Plugin;

export default metaPlugin;
