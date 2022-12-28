import { fetchTags } from '../infrastructure/GitHub';
import {version} from './System';

/**
 * 最新版かどうかを返す。最新版だったら空文字が、そうでなければその最新版の番号が出る
 * @returns {Promise<string>}
 */
export const checkVersion = async () => {
  const vers = await getVersions();

  if (vers.length === 0) return '';

  return compare(version(), vers[0]) ? vers[0] : '';
};

/**
 * バージョンをとってくる
 * @returns {Promise<string[]>}
 */
const getVersions = async () => {
  return (await fetchTags()).map(item => item?.name).filter(item => item);
};

/**
 * 現在バージョンが最新だったらtrueが返る
 * @param {string} now
 * @param {string} current
 * @returns {boolean}
 */
const compare = (now, current) => {
  return parge(now) < parge(current);
};

/**
 * バージョン番号を数字にして返す
 * @param {string} verStr
 * @returns {number}
 */
const parge = (verStr) => {
  return Number(verStr.split('.').map(num => num.padStart(3, '0')).join(''));
};
