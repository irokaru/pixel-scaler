import red from './color/red.json';
import red_dark from './color/red_dark.json';
import blue from './color/blue.json';
import blue_dark from './color/blue_dark.json';
import green from './color/green.json';
import green_dark from './color/green_dark.json';
import gray from './color/gray.json';
import dark from './color/dark.json';

import {getItem, setItem, existsItem} from '../lib/LocalStorage';

// --------------------------------------------------------------------

const DEFAULT_COLOR_KEY = 'red';
const STORAGE_KEY = 'color';

export const colors = {
  red, blue, green, gray, red_dark, blue_dark, green_dark, dark
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
};
