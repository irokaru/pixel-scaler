import {getFileSize, fileToImageData, resizeImageData} from '../FileUtil';

/**
 * execute nearestneighbor scaling
 * @param {string} url url of file
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
 * ジャギジャギに拡大縮小するやつ
 * @param {ImageData} imageData
 * @param {{width: number, height: number}} orgSize
 * @param {number} scalePer
 * @param {number} pixelSize
 * @returns {Promise<ImageData>}
 */
const scale = async (imageData, orgSize, scalePer, pixelSize) => {
  return await resizeImageData(imageData, orgSize.width * scalePer * (1/pixelSize) / 100, orgSize.height * scalePer * (1/pixelSize) / 100, false);
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
