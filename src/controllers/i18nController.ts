import { createI18n } from "vue-i18n";

import * as i18nService from "@/services/i18nService";

export const getLanguageKeys = () => {
  return Object.keys(i18nService.getAllLanguage());
};

export const getLanguageKey = () => {
  return i18nService.getLanguageKey();
};

export const setLanguageKey = (key: string) => {
  i18nService.setLanguageKey(key);
};

/**
 * The Vue I18n instance.
 */
export const vueI18n = createI18n({
  locale: getLanguageKey(),
  fallbackLocale: i18nService.DefaultLanguage,
  messages: i18nService.getAllLanguage(),
});
