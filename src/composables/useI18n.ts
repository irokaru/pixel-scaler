import { readonly, watch, ref } from "vue";

import {
  getLanguageKeys,
  setLanguageKey,
  vueI18n,
} from "@/controllers/i18nController";

export type i18nLocales = typeof vueI18n.global.locale;

const useI18n = () => {
  const languageKey = ref(vueI18n.global.locale);
  const languageKeys = getLanguageKeys();

  const updateLanguageKey = (key: i18nLocales) => {
    setLanguageKey(key);
    languageKey.value = key;
  };

  watch<i18nLocales>(languageKey, (newLanguageKey: i18nLocales) =>
    updateLanguageKey(newLanguageKey),
  );

  return { languageKey, languageKeys: readonly(languageKeys) };
};

export default useI18n;
