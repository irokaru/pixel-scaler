import {getFileSize, fileToImageData, imageDataToBase64, resizeImageData} from '../lib/FileUtil';
import {xbr2x, xbr3x, xbr4x} from 'xbr-js';

export default {
  /**
   * きれいに拡大縮小するやつ
   * @param {File} file
   * @param {number} scalePer (100-400)
   * @param {number} pixelSize (1-4)
   * @return {Promise<{status: string, org: File, image: {base64: string, filename: string, scale: number, pixelSize: number}, message?: string}>}
   */
  async scale(file, scalePer, pixelSize) {
    const url = URL.createObjectURL(file)

    const error = this._validateFile(file);
    if (error !== '') {
      return {
        status  : 'failed',
        message : error,
        org     : file,
      };
    }

    const urlError = await this._validateImageUrl(url)
    if (urlError !== '') {
      return {
        status: 'failed',
        message: urlError,
        org: file,
      };
    }

    const orgSize = await getFileSize(url);

    const sizeError = this._validateFileSize(orgSize, pixelSize);
    if (sizeError !== '') {
      return {
        status  : 'failed',
        message : sizeError,
        org     : file,
      };
    }

    const orgImageData = await fileToImageData(url, orgSize.width, orgSize.height, 1 / pixelSize);
    const scaled = await this._scale(orgImageData, orgSize, scalePer, pixelSize);

    return {
      status: 'success',
      image : {
        base64   : imageDataToBase64(scaled),
        filename : file.name,
        scale    : scalePer,
        pixelSize: pixelSize
      },
      org: file,
      unload: () => URL.revokeObjectURL(url),
    };
  },

  /**
   * パラメータを範囲内に収めて返すやつ
   * @param {number} pixelSize
   * @param {number} scale
   * @returns {[number, number]}
   */
  adjustParams(pixel, scale) {
    pixel = pixel >> 0;
    scale = scale >> 0;

    if (pixel < 1) pixel = 1;
    if (4 < pixel) pixel = 4;

    if (scale < 100) scale = 100;
    if (400 < scale) scale = 400;

    return [pixel, scale];
  },

  /**
   * xBRを実行するやつ
   * @param {ImageData} orgSizeImageData
   * @param {{width: number, height: number}} orgSize
   * @param {number} scalePer (100-400)
   * @param {number} pixelSize (1-4)
   * @returns {Promise<ImageData>}
   */
  async _scale(orgSizeImageData, orgSize, scalePer, pixelSize) {
    let array = new Uint32Array(orgSizeImageData.data.buffer);

    // for big pixel image
    if (pixelSize !== 1) {
      const scaleInt = this._getScaleInteger(pixelSize * 100);
      const toOrgSizeXbr = this._getXbr(scaleInt);

      array = toOrgSizeXbr(array, orgSizeImageData.width, orgSizeImageData.height);
    }

    const scaleInt = this._getScaleInteger(scalePer);
    const xbr = this._getXbr(scaleInt);
    const scaled = xbr(array, orgSize.width, orgSize.height);

    const imageData = new ImageData(new Uint8ClampedArray(scaled.buffer), orgSize.width * scaleInt, orgSize.height * scaleInt);
    return await resizeImageData(imageData, orgSize.width * scalePer / 100, orgSize.height * scalePer / 100);
  },

  /**
   * 倍率整数を返す
   * @param {number} size
   * @return {number}
   */
  _getScaleInteger(size) {
    const int = parseInt(size / 100);

    if (int < 2) return 2;

    return int;
  },

  /**
   * 利用するべきxBRのメソッドを返す
   * @param {number} sizeInt
   * @returns {Function}
   */
  _getXbr(sizeInt) {
    const methods = {
      2: xbr2x,
      3: xbr3x,
      4: xbr4x,
    };

    return methods[sizeInt];
  },

  /**
   * ファイルのバリデーション
   * @param {unknown} val
   * @return {string}
   */
  _validateFile (val) {
    if (typeof val !== 'object' || Array.isArray(val) || toString.call(val) !== '[object File]') {
      return 'error-invalid-file';
    }

    if (!val.type.match(/^image\/(png|jpeg|gif)/)) {
      return 'error-invalid-image-type';
    }

    return '';
  },

  /**
   * Blob URLのバリデーション
   * @param {string} url 
   */
  async _validateImageUrl(url) {
    try {
      await fetch(url)

      return ''
    } catch (e) {
      return 'error-invalid-url'
    }
  },

  /**
   * ファイルの幅、高さのバリデーション
   * @param {{width: number, height: number}} size
   * @param {number} pixelSize
   * @returns {string}
   */
  _validateFileSize(size, pixelSize) {
    const modWidth = size.width % pixelSize;
    const modHeight = size.height %pixelSize;

    if (0 < modWidth + modHeight) {
      return 'error-invalid-image-size';
    }

    return '';
  }
};
