const packageJson = require('../../package.json');
import Validator from 'nonono-validator';

export default {
  /**
   * バージョン取得
   * @returns {string}
   */
  version() {
    return packageJson.version;
  },

  /**
   * 言語設定の取得
   * @returns {string}
   */
  language() {
    return (window.navigator.languages && window.navigator.languages[0]) ||
    window.navigator.language ||
    window.navigator.userLanguage ||
    window.navigator.browserLanguage;
  },

  /**
   * ウェブかどうか
   * @returns {boolean}
   */
  isWeb() {
    return !Validator.hasKeyInObject(process.env, 'IS_ELECTRON');
  },

  /**
   * electronかどうか
   * @returns {boolean}
   */
  isElectron() {
    return !this.isWeb();
  }
}
