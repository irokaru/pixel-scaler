import { vueI18n } from "@/config/i18n";
import * as i18nService from "@/services/i18nService";

export const getLanguageKeys = () => {
  return vueI18n.global.availableLocales;
};

export const getLanguageKey = () => {
  return i18nService.getLanguageKey();
};

export const setLanguageKey = (key: string) => {
  i18nService.setLanguageKey(key);
};
