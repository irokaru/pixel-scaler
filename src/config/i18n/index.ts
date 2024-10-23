import { createI18n } from "vue-i18n";

import {
  DefaultLanguage,
  getAllLanguage,
  loadLanguageKey,
} from "@/services/i18nService";

/**
 * The Vue I18n instance.
 */
export const vueI18n = createI18n({
  locale: loadLanguageKey(),
  fallbackLocale: DefaultLanguage,
  messages: getAllLanguage(),
  globalInjection: true,
  legacy: false,
});

export const vueI18nLocales = vueI18n.global.availableLocales;
export type vueI18nLocales = (typeof vueI18nLocales)[number];
