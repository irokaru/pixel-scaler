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
  try {
    const response = await fetch('https://api.github.com/repos/irokaru/pixel-scaler/tags');
    const json = response.ok ? await response.json() : [];
    return json.map(item => item.name);
  } catch {
    return [];
  }
};

/**
 * 現在バージョンが最新だったらtrueが返る
 * @param {string} now
 * @param {string} current
 * @returns {boolean}
 */
const compare = (now, current) => {
  now     = parge(now);
  current = parge(current);
  return now < current;
};

/**
 * バージョン番号を数字にして返す
 * @param {string} verStr
 * @returns {number}
 */
const parge = (verStr) => {
  const regex = new RegExp('\\.', 'g');
  return Number(verStr.replace(regex, ''));
};
