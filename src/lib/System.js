const packageJson = require('../../package.json');
import Validator from 'nonono-validator';

/**
 * バージョン取得
 * @returns {string}
 */
export const version = () => {
  return packageJson.version;
};

/**
 * 言語設定の取得
 * @returns {string}
 */
export const language = () => {
  return (window.navigator.languages && window.navigator.languages[0]) ||
  window.navigator.language ||
  window.navigator.userLanguage ||
  window.navigator.browserLanguage;
};

/**
 * ウェブかどうか
 * @returns {boolean}
 */
export const isWeb = () => {
  return !Validator.hasKeyInObject(process.env, 'IS_ELECTRON') || process.env.IS_ELECTRON === '0';
};

/**
 * electronかどうか
 * @returns {boolean}
 */
export const isElectron = () => {
  return !isWeb();
};

/**
 * UNITE向けかどうか
 * @returns {boolean}
 */
export const isUnite = () => {
  return Validator.hasKeyInObject(process.env, 'VUE_APP_IS_UNITE') && process.env.VUE_APP_IS_UNITE !== '0';
};
