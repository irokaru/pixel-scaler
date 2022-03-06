import {getFileSize, fileToImageData, imageDataToBase64, resizeImageData} from '../lib/FileUtil';
import {xbr2x, xbr3x, xbr4x} from 'xbr-js';

/**
 * きれいに拡大縮小するやつ
 * @param {File} file
 * @param {number} scalePer (100-400)
 * @param {number} pixelSize (1-4)
 * @return {Promise<{status: string, org: File, image: {base64: string, filename: string, scale: number, pixelSize: number}, message?: string}>}
 */
export const scale = async (file, scalePer, pixelSize) => {
  const error = validateFile(file);
  if (error !== '') {
    return {
      status  : 'failed',
      message : error,
      org     : file,
    };
  }

  const orgSize = await getFileSize(file);

  const sizeError = validateFileSize(orgSize, pixelSize);
  if (sizeError !== '') {
    return {
      status  : 'failed',
      message : sizeError,
      org     : file,
    };
  }

  const scaled = await _scale(file, orgSize, scalePer, pixelSize);

  return {
    status: 'success',
    image : {
      base64   : imageDataToBase64(scaled),
      filename : file.name,
      scale    : scalePer,
      pixelSize: pixelSize
    },
    org: file,
  };
};

/**
 * パラメータを範囲内に収めて返すやつ
 * @param {number} pixelSize
 * @param {number} scale
 * @returns {[number, number]}
 */
export const adjustParams = (pixel, scale) => {
  pixel = pixel >> 0;
  scale = scale >> 0;

  if (pixel < 1) pixel = 1;
  if (4 < pixel) pixel = 4;

  if (scale < 100) scale = 100;
  if (400 < scale) scale = 400;

  return [pixel, scale];
};

/**
 * xBRを実行するやつ
 * @param {File} file
 * @param {{width: number, height: number}} orgSize
 * @param {number} scalePer (100-400)
 * @param {number} pixelSize (1-4)
 * @returns {Promise<ImageData>}
 */
const _scale = async (file, orgSize, scalePer, pixelSize) => {
  const orgSizeImageData = await fileToImageData(file, orgSize.width, orgSize.height, 1 / pixelSize);
  let array = new Uint32Array(orgSizeImageData.data.buffer);

  // for big pixel image
  if (pixelSize !== 1) {
    const scaleInt = getScaleInteger(pixelSize * 100);
    const toOrgSizeXbr = getXbr(scaleInt);

    array = toOrgSizeXbr(array, orgSizeImageData.width, orgSizeImageData.height);
  }

  const scaleInt = getScaleInteger(scalePer);
  const xbr = getXbr(scaleInt);
  const scaled = xbr(array, orgSize.width, orgSize.height);

  const imageData = new ImageData(new Uint8ClampedArray(scaled.buffer), orgSize.width * scaleInt, orgSize.height * scaleInt);
  return await resizeImageData(imageData, orgSize.width * scalePer / 100, orgSize.height * scalePer / 100);
};

/**
 * 倍率整数を返す
 * @param {number} size
 * @return {number}
 */
const getScaleInteger = (size) => {
  const int = parseInt(size / 100);

  if (int < 2) return 2;

  return int;
};

/**
 * 利用するべきxBRのメソッドを返す
 * @param {number} sizeInt
 * @returns {Function}
 */
const getXbr = (sizeInt) => {
  const methods = {
    2: xbr2x,
    3: xbr3x,
    4: xbr4x,
  };

  return methods[sizeInt];
};

/**
 * ファイルのバリデーション
 * @param {unknown} val
 * @return {string}
 */
const validateFile = (val) => {
  if (typeof val !== 'object' || Array.isArray(val) || toString.call(val) !== '[object File]') {
    return 'error-invalid-file';
  }

  if (!val.type.match(/^image\/(png|jpeg|gif)/)) {
    return 'error-invalid-image-type';
  }

  return '';
};

/**
 * ファイルの幅、高さのバリデーション
 * @param {{width: number, height: number}} size
 * @param {number} pixelSize
 * @returns {string}
 */
const validateFileSize = (size, pixelSize) => {
  const modWidth = size.width % pixelSize;
  const modHeight = size.height %pixelSize;

  if (0 < modWidth + modHeight) {
    return 'error-invalid-image-size';
  }

  return '';
};
