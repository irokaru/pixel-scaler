import red from './red.json';
import blue from './blue.json';
import green from './green.json';
import gray from './gray.json';
import dark from './dark.json';

import {getItem, setItem, existsItem} from '../lib/LocalStorage';

// --------------------------------------------------------------------

const DEFAULT_COLOR_KEY = 'red';
const STORAGE_KEY = 'color';

export const colors = {
  red, blue, green, gray, dark
};

// --------------------------------------------------------------------

/**
 * デフォルトの色の名前を返す
 * @returns {string}
 */
export const getDefaultColorKey = () => {
  if (!existsItem(STORAGE_KEY)) return DEFAULT_COLOR_KEY;

  const key = getItem(STORAGE_KEY);

  if (!existsColorKey(key)) return DEFAULT_COLOR_KEY;

  return key;
};

/**
 * デフォルトの色の値を返す
 * @returns {string}
 */
export const getDefaultColorValues = () => {
  const key = getDefaultColorKey();
  return colors[key];
};

/**
 * デフォルトの色の名前を保存する
 * @returns {boolean}
 */
export const setDefaultColorKey = (key) => {
  if (!existsColorKey(key)) return false;

  setItem(STORAGE_KEY, key);

  return true;
};

/**
 * 色が存在するか
 * @param {string} key
 * @returns {boolean}
 */
const existsColorKey = (key) => {
  return Object.keys(colors).includes(key);
}
