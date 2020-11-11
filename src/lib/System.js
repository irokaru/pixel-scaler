const packageJson = require('../../package.json');
import Validator from 'nonono-validator';

export default {
  /**
   * バージョン取得
   * @returns {string}
   */
  version() {
    return '0.1.0' || packageJson.version;
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
    return Validator.hasKeyInObject(process.env, 'IS_ELECTRON');
  }
}
