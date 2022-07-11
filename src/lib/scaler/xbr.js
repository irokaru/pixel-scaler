import {getFileSize, fileToImageData, resizeImageData} from '../FileUtil';
import {xbr2x, xbr3x, xbr4x} from 'xbr-js';

/**
 * execute xbr scaling
 * @param {File} file
 * @param {number} scalePer 100-
 * @param {number} pixelSize
 * @return {Promise<ImageData>}
 */
export const execute = async (file, scalePer, pixelSize) => {
  const fileError = validateFile(file);
  if (fileError !== '') throw new Error(fileError);

  const url = URL.createObjectURL(file);

  const urlError = await validateImageUrl(url)
  if (urlError !== '') throw new Error(urlError);

  const orgSize = await getFileSize(url);

  const sizeError = validateImageSize(orgSize, pixelSize);
  if (sizeError !== '') throw new Error(sizeError);

  const orgImageData = await fileToImageData(url, orgSize.width, orgSize.height, 1 / pixelSize);

  return await scale(orgImageData, orgSize, pixelSize * scalePer);
};

/**
 *
 * @param {ImageData} imageData
 * @param {{width: number, height: number}} orgSize
 * @param {number} scalePer 100-
 * @returns {Promise<ImageData>}
 */
const scale = async (imageData, orgSize, scalePer) => {
  let uarray = new Uint32Array(imageData.data.buffer);
  const size = {width: imageData.width, height: imageData.height};

  for (const per of calcScalePers(scalePer)) {
    const xbr = getXbrFunctionByScalePercent(per);

    uarray = xbr(uarray, size.width, size.height);

    size.width  = size.width * per / 100;
    size.height = size.height * per / 100;
  }

  const scaled = new ImageData(new Uint8ClampedArray(uarray.buffer), size.width, size.height);
  return resizeImageData(scaled, orgSize.width * scalePer / 100, orgSize.height * scalePer / 100);
};

/**
 * return number between 100% to 400% array by split scalePer
 * TODO: more simple logic
 * @param {number} scalePer (100-)
 * @param {number} max (101-)
 * @return {number[]} (100-max)[]
 */
export const calcScalePers = (scalePer, max = 400) => {
  if (!Number.isInteger(scalePer) || scalePer <= 0) throw new Error('invalid scalePer value');
  if (!Number.isInteger(max) || max <= 100) throw new Error('invalid max value');

  if (scalePer <= max) return [scalePer];

  scalePer /= 100;
  max      /= 100;

  const scalePers = [max];

  const div = scalePer / max;

  if (div <= max) scalePers.push(div);

  if (max < div) scalePers.push(...calcScalePers(div * 100 >> 0, max * 100).map(per => per /= 100));

  return scalePers.map(per => per * 100);
};

/**
 * return xbr scale function by scale percent
 * @param {number} scalePer (100-400)
 * @return {(image: Uint32Array, width: number, height: number) => Uint32Array}
 */
const getXbrFunctionByScalePercent = (scalePer) => {
  const methods = {
    2: xbr2x,
    3: xbr3x,
    4: xbr4x,
  };

  if (scalePer < 200) return methods[2];

  return methods[(scalePer / 100) >> 0];
};

/**
 * validator for file
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
 * validator for blob url
 * @param {string} url
 */
const validateImageUrl = async (url) => {
  try {
    await fetch(url)

    return ''
  } catch (e) {
    return 'error-invalid-url'
  }
};

/**
 * validator for image width and height
 * @param {{width: number, height: number}} size
 * @param {number} pixelSize
 * @returns {string}
 */
const validateImageSize = (size, pixelSize) => {
  const modWidth  = size.width % pixelSize;
  const modHeight = size.height % pixelSize;

  if (0 < modWidth + modHeight) return 'error-invalid-image-size';

  return '';
};
