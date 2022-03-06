/**
 * 保存する
 * @param {string} key
 * @param {string} value
 */
export const setItem = (key, value) => {
  if (value) {
    localStorage.setItem(key, value);
    return;
  }
  localStorage.removeItem(key);
};

/**
 * 取得する
 * @param {string} key
 * @returns {string|null}
 */
export const getItem = (key) => {
  return localStorage.getItem(key);
};

/**
 * 存在するか
 * @param {string} key
 * @returns {boolean}
 */
export const existsItem = (key) => {
  return localStorage.getItem(key) !== null;
};
