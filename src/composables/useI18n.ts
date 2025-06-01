import { readonly, watch, ref } from "vue";

import { vueI18n, vueI18nLocales } from "@/core/plugins/i18n";
import { saveLanguageKey } from "@/core/services/i18nService";

const useI18n = () => {
  const languageKey = ref(vueI18n.global.locale);

  const updateLanguageKey = (key: vueI18nLocales) => {
    saveLanguageKey(key);
    languageKey.value = key;
  };

  watch(
    languageKey,
    (newLanguageKey: vueI18nLocales) => {
      document.documentElement.lang = newLanguageKey;
      updateLanguageKey(newLanguageKey);
    },
    { immediate: true },
  );

  return { languageKey, languageKeys: readonly(vueI18nLocales) };
};

export default useI18n;
