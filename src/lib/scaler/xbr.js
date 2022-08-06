import {getFileSize, fileToImageData, resizeImageData} from '../FileUtil';
import {xbr2x, xbr3x, xbr4x} from 'xbr-js/src/index';

/**
 * execute xbr scaling
 * @param {url} url url of file
 * @param {number} scalePer 100-
 * @param {number} pixelSize
 * @return {Promise<{message: 'success'|string, image?: ImageData}>}
 */
export const execute = async (url, scalePer, pixelSize) => {
  const orgSize = await getFileSize(url);

  const sizeError = validateImageSize(orgSize, pixelSize);
  if (sizeError !== '') return {message: sizeError};

  const orgImageData = await fileToImageData(url, orgSize.width, orgSize.height, 1 / pixelSize);

  const scaled = await scale(orgImageData, orgSize, pixelSize * scalePer, pixelSize);

  return {
    message: 'success',
    image: scaled,
  };
};

/**
 *
 * @param {ImageData} imageData
 * @param {{width: number, height: number}} orgSize
 * @param {number} scalePer 100-
 * @param {number} pixelSize 1-
 * @returns {Promise<ImageData>}
 */
const scale = async (imageData, orgSize, scalePer, pixelSize) => {
  let uarray = new Uint32Array(imageData.data.buffer);
  const size = {width: imageData.width, height: imageData.height};

  for (const per of calcScalePers(scalePer)) {
    const [xbr, retio] = getXbrFunctionByScalePercent(per);

    uarray = xbr(uarray, size.width, size.height);

    size.width  = size.width * retio;
    size.height = size.height * retio;
  }

  const scaled = new ImageData(new Uint8ClampedArray(uarray.buffer), size.width, size.height);
  return resizeImageData(scaled, orgSize.width * scalePer * (1/pixelSize) / 100, orgSize.height * scalePer * (1/pixelSize) / 100);
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
 * @return {[(image: Uint32Array, sourceWidth: number, sourceHeight: number, options: any) => Uint32Array, number]}
 */
const getXbrFunctionByScalePercent = (scalePer) => {
  const methods = {
    2: xbr2x,
    3: xbr3x,
    4: xbr4x,
  };

  if (scalePer < 200) return [methods[2], 2];

  const ceil = Math.ceil(scalePer/100);
  return [methods[ceil], ceil];
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
