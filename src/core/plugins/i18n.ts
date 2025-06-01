import { createI18n } from "vue-i18n";

import {
  getAllLanguage,
  loadLanguageKeyInStorage,
} from "@/core/services/i18nService";

import { DefaultLanguage } from "../constants/i18n";

/**
 * The Vue I18n instance.
 */
export const vueI18n = createI18n({
  locale: loadLanguageKeyInStorage(),
  fallbackLocale: DefaultLanguage,
  messages: getAllLanguage(),
  globalInjection: true,
  legacy: false,
});

export const vueI18nLocales = vueI18n.global.availableLocales;
export type vueI18nLocales = (typeof vueI18nLocales)[number];
