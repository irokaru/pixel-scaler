import { createI18n } from 'vue-i18n/index';

import ja from './ja.json';
import en from './en.json';
import es from './es.json';

import System from '../lib/System';
import LocalStorage from '../lib/LocalStorage';

// --------------------------------------------------------------------

const STORAGE_KEY = 'language';

const langs = {
  ja, en, es
};

// --------------------------------------------------------------------

/**
 * デフォルトの言語名を返す
 * @returns {string}
 */
export const getDefaultLanguage = () => {
  if (!LocalStorage.existItem(STORAGE_KEY)) return System.language();

  const lang = LocalStorage.getItem(STORAGE_KEY);

  if (!existsLanguage(lang)) System.language();

  return lang;
};

/**
 * デフォルトの言語名を保存する
 * @param {string} lang
 * @returns {boolean}
 */
export const setDefaultLanguage = (lang) => {
  if (!existsLanguage(lang)) return false;

  LocalStorage.setItem(STORAGE_KEY, lang);

  return true;
};

/**
 * 言語名を返す
 * @returns {string[]}
 */
export const getLanguageNames = () => {
  return Object.keys(langs);
};

/**
 * 言語が存在するか
 * @param {string} lang
 * @returns {boolean}
 */
const existsLanguage = (lang) => {
  return getLanguageNames().includes(lang);
};

// --------------------------------------------------------------------

export const i18n = createI18n({
  locale: getDefaultLanguage(),
  fallbackLocale: 'en',
  messages: langs
});
