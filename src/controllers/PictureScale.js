import {existsUrlFile, imageDataToBase64, isImageFile, toShowable} from '../lib/FileUtil';
import {execute as executeXbr} from '../lib/scaler/xbr';
import {execute as executeNn} from '../lib/scaler/nearestneighbor';

/**
 * きれいに拡大縮小するやつ
 * @param {File} file
 * @param {number} scalePer (100-800)
 * @param {number} pixelSize (1-4)
 * @param {string} algo
 * @return {Promise<{status: 'success', org: File, image: {base64: string, filename: string, scale: number, pixelSize: number}}|{status: 'failed', org: File, message: string}>}
 */
export const scale = async (file, scalePer, pixelSize, algo) => {
  const fileUrl = toShowable(file);

  const fileError = isImageFile(file);
  if (fileError !== '') return error(message, file);

  const urlError = await existsUrlFile(fileUrl);
  if (urlError !== '') return error(message, file);

  const algoMethod = getScaleAlgorithm(algo);

  if (!algoMethod) throw new Error(`undefined algo: ${algo}`);

  const {message, image} = await algoMethod(fileUrl, scalePer, pixelSize);

  if (message !== 'success') error(message, file);

  return {
    status: 'success',
    image : {
      base64   : imageDataToBase64(image),
      filename : file.name,
      scale    : scalePer,
      pixelSize: pixelSize
    },
    org: file,
    unload: () => URL.revokeObjectURL(fileUrl),
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
  if (800 < scale) scale = 800;

  return [pixel, scale];
};

/**
 * キーをもとにアルゴリズムを返す
 * @param {string} key
 * @returns {(url: string, scalePer: number, pixelSize: number) => Promise<{message: string, image: ImageData}>}
 */
const getScaleAlgorithm = (key) => {
  const algorithms = {
    xbr: executeXbr,
    nn : executeNn,
  };

  if (!Object.keys(algorithms).includes(key)) return null;

  return algorithms[key];
};

/**
 * create error status object
 * @param {string} message
 * @param {File} org
 * @returns {{status: string, message: string, org: File}}
 */
const error = (message, org) => {
  return {
    status: 'failed',
    message,
    org,
  };
};
