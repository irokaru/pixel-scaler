import {imageDataToBase64} from '../lib/FileUtil';
import {execute as executeXbr} from '../lib/scaler/xbr';

/**
 * きれいに拡大縮小するやつ
 * @param {File} file
 * @param {number} scalePer (100-800)
 * @param {number} pixelSize (1-4)
 * @return {Promise<{status: 'success', org: File, image: {base64: string, filename: string, scale: number, pixelSize: number}}|{status: 'failed', org: File, message: string}>}
 */
export const scale = async (file, scalePer, pixelSize) => {
  const {message, image} = await executeXbr(file,scalePer, pixelSize);

  if (message !== 'success') {
    return {
      status: 'failed',
      message,
      org: file,
    };
  }

  return {
    status: 'success',
    image : {
      base64   : imageDataToBase64(image),
      filename : file.name,
      scale    : scalePer,
      pixelSize: pixelSize
    },
    org: file,
    unload: () => URL.revokeObjectURL(URL.createObjectURL(file)),
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
