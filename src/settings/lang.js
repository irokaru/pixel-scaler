import { createI18n } from 'vue-i18n/index';

import ja from './i18n/ja.json';
import en from './i18n/en.json';
import cn from './i18n/cn.json';
import es from './i18n/es.json';

import {language} from '../lib/System';
import {getItem, setItem, existsItem} from '../lib/LocalStorage';

// --------------------------------------------------------------------

const STORAGE_KEY = 'language';

const langs = {
  ja, en, cn, es
};

// --------------------------------------------------------------------

/**
 * デフォルトの言語名を返す
 * @returns {string}
 */
export const getDefaultLanguage = () => {
  if (!existsItem(STORAGE_KEY)) return language();

  const lang = getItem(STORAGE_KEY);

  if (!existsLanguage(lang)) language();

  return lang;
};

/**
 * デフォルトの言語名を保存する
 * @param {string} lang
 * @returns {boolean}
 */
export const setDefaultLanguage = (lang) => {
  if (!existsLanguage(lang)) return false;

  setItem(STORAGE_KEY, lang);

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
