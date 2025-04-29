import {
  getLocalStorage,
  setLocalStorage,
} from "@/core/infrastructure/storage";
import { getBrowserLanguage, isUnite } from "@/core/system";

import { LanguageKey } from "../@types/i18n";
import {
  DefaultLanguage,
  Languages,
  LanguagesForUnite,
  StorageKey,
} from "../constants/i18n";

/**
 * Retrieves all available languages based on the current environment.
 * If the environment is "unite", it returns languages for unite, otherwise it returns default languages.
 *
 * @returns An array of available languages.
 */
export const getAllLanguage = () => {
  return isUnite() ? LanguagesForUnite : Languages;
};

/**
 * Retrieves the language key to be used for localization.
 * If a language is stored in local storage, it is returned.
 * Otherwise, the browser language is used.
 * The returned language key is validated to ensure it is supported.
 *
 * @returns The valid language key to be used for localization.
 */
export const loadLanguageKeyInStorage = () => {
  const storedLanguage = getLocalStorage(StorageKey);
  const languageKey = storedLanguage ?? getBrowserLanguage();
  return getValidLanguageKey(languageKey);
};

/**
 * Sets the language key in the local storage if it exists.
 *
 * @param key - The language key to set.
 */
export const saveLanguageKey = (key: LanguageKey) => {
  if (existsLanguageKey(key)) {
    setLocalStorage(StorageKey, key);
  }
};

const getValidLanguageKey = (key: string): LanguageKey => {
  return existsLanguageKey(key) ? key : DefaultLanguage;
};

const existsLanguageKey = (key: string): key is LanguageKey => {
  return Object.keys(getAllLanguage()).includes(key);
};
