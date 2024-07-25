import { readonly, watch, ref } from "vue";

import { vueI18n, vueI18nLocales } from "@/config/i18n";
import { getLanguageKeys, setLanguageKey } from "@/controllers/i18nController";

const useI18n = () => {
  const languageKey = ref(vueI18n.global.locale);
  const languageKeys = getLanguageKeys();

  const updateLanguageKey = (key: vueI18nLocales) => {
    setLanguageKey(key);
    languageKey.value = key;
  };

  watch<vueI18nLocales>(languageKey, (newLanguageKey: vueI18nLocales) =>
    updateLanguageKey(newLanguageKey),
  );

  return { languageKey, languageKeys: readonly(languageKeys) };
};

export default useI18n;
