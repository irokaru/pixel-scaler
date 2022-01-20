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
