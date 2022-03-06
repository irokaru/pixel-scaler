export default {
  /**
   * 保存する
   * @param {string} key
   * @param {string} value
   */
  setItem(key, value) {
    if (value) {
      localStorage.setItem(key, value);
      return;
    }
    localStorage.removeItem(key);
  },

  /**
   * 取得する
   * @param {string} key
   * @returns {string|null}
   */
  getItem(key) {
    return localStorage.getItem(key);
  },

  /**
   * 存在するか
   * @param {string} key
   * @returns {boolean}
   */
  existItem(key) {
    return localStorage.getItem(key) !== null;
  },
};
