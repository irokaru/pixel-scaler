import { createI18n } from "vue-i18n";

import cn from "../config/i18n/cn.json";
import en from "../config/i18n/en.json";
import es from "../config/i18n/es.json";
import ja from "../config/i18n/ja.json";
import tr from "../config/i18n/tr.json";
import {
  getLocalStorage,
  setLocalStorage,
} from "../core/infrastructure/storage";
import { getBrowserLanguage, isUnite } from "../core/system";

const StorageKey = "language";
const DefaultLanguage = "en";

const languages = {
  ja,
  en,
  cn,
  es,
  tr,
};

const languagesForUnite = {
  ja,
  en,
  cn,
};

/**
 * Retrieves the language key to be used for localization.
 * If a language is stored in local storage, it is returned.
 * Otherwise, the browser language is used.
 * The returned language key is validated to ensure it is supported.
 *
 * @returns The valid language key to be used for localization.
 */
export const getLanguageKey = () => {
  const storedLanguage = getLocalStorage(StorageKey);
  const languageKey = storedLanguage ?? getBrowserLanguage();
  return getValidLanguageKey(languageKey);
};

/**
 * Sets the language key in the local storage if it exists.
 *
 * @param key - The language key to set.
 */
export const setLanguageKey = (key: string) => {
  if (existsLanguageKey(key)) {
    setLocalStorage(StorageKey, key);
  }
};

const getValidLanguageKey = (key: string) => {
  const allLanguages = getAllLanguage();
  return key in allLanguages ? key : DefaultLanguage;
};

const existsLanguageKey = (key: string) => {
  return Object.keys(getAllLanguage()).includes(key);
};

const getAllLanguage = () => {
  return isUnite() ? languagesForUnite : languages;
};

/**
 * The Vue I18n instance.
 */
export const vueI18n = createI18n({
  locale: getLanguageKey(),
  fallbackLocale: DefaultLanguage,
  messages: getAllLanguage(),
});
