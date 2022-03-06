import { isElectron } from "./System";

/**
 * OGP向けタグを設定する
 * @param {string} property
 * @param {string} content
 * @returns {void}
 */
export const setOgpValue = (property, content) => {
  if (isElectron) return;

  const meta = document.querySelector(`meta[property='${property}']`);
  meta ? changeOgpValue(meta, content) : createOgpValue(property, content);
};

/**
 * OGP向けタグを配列から設定していく
 * @param {{property: string, content: string}[]} values
 * @returns {void}
 */
export const setOgpValuesByArray = (values) => {
  for (const {property, content} of values) {
    setOgpValue(property, content);
  }
};

/**
 * OGP向けタグの値を変更する
 * @param {Element} elm
 * @param {string} content
 * @returns {void}
 */
const changeOgpValue = (elm, content) => {
  elm.setAttribute('content', content);
};

/**
 * OGP向けタグを生成して追加する
 * @param {string} property
 * @param {string} content
 */
const createOgpValue = (property, content) => {
  const metaTag = document.createElement('meta');
  metaTag.setAttribute('property', property);
  metaTag.setAttribute('content', content);
}
