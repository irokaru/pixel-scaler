import FileUtil  from './FileUtil';
import Validator from 'nonono-validator';
import {xbr2x, xbr3x, xbr4x} from 'xbr-js';
import ScaledImage from './ScaledImage';

export default {
  /**
   * きれいに拡大縮小するやつ
   * @param {File} file
   * @param {number} scalePer (100-400)
   * @param {number} pixelSize (1-4)
   * @return {Promise<{status: string, org: File, image: ScaledImage, messages?: object}>}
   */
  async scale(file, scale, pixelSize) {
    const params = this._toParams(file, scale, pixelSize);

    if (!this._validate(params)) {
      return {
        status  : 'failed',
        messages: this._validate(params, true),
      };
    }

    const orgSize = await FileUtil.getFileSize(file);

    const orgImageData = await FileUtil.fileToImageData(file, orgSize.width, orgSize.height);
    const orgPixelView = new Uint32Array(orgImageData.data.buffer);

    const sizeInt = this._getSizeInteger(scale);
    const xbr     = this._getXbr(sizeInt);
    const scaled  = xbr(orgPixelView, orgSize.width, orgSize.height);

    const imageData = new ImageData(new Uint8ClampedArray(scaled.buffer), orgSize.width * sizeInt, orgSize.height * sizeInt);
    const resized   = await FileUtil.resizeImageData(imageData, orgSize.width * scale / 100, orgSize.height * scale / 100);

    return {
      status: 'success',
      image : new ScaledImage({
        base64  : FileUtil.imageDataToBase64(resized),
        filename: file.name,
        type    : file.type,
        scale   : scale,
      }),
      org: file,
    };
  },

  /**
   * サイズを範囲内に収めて返すやつ
   * @param {number} size
   * @returns {number}
   */
  adjustSize(size) {
    if (size > 400) {
      return 400;
    }

    if (size < 100) {
      return 100;
    }

    return size >> 0;
  },

  /**
   * 倍率整数を返す
   * @param {number} size
   * @return {number}
   */
  _getSizeInteger(size) {
    if (size <= 200) {
      return 2;
    }

    if (size <= 300) {
      return 3;
    }

    if (size <= 400) {
      return 4;
    }

    if (size === 400) {
      return 4;
    }
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
   * バリデーション用のパラメータに変換する
   * @param {unknown} file
   * @param {unknown} size
   * @param {unknown} pixelSize
   * @returns {object}
   */
  _toParams (file, size, pixelSize) {
    return {
      file: file,
      size: size,
      pixelSize: pixelSize,
    };
  },

  /**
   * バリデーション
   * @param {object} params
   * @param {boolean} errors
   * @returns {boolean}
   */
  _validate(params, errors = false) {
    const rules = {
      file: {
        type: 'callback', callback: this._validateFile, name: 'ファイル',
      },
      size: {
        type: 'integer', min: 100, max: 400, name: '拡大率',
      },
      pixelSize: {
        type: 'integer', min: 1, max: 4, name:'元のピクセルサイズ',
      },
    };

    const v = (new Validator()).rules(params, rules);

    return errors ? v.errors() : v.exec();
  },

  /**
   * ファイルのバリデーション
   * @param {unknown} val
   * @return {array}
   */
  _validateFile (val) {
    const ret = [];

    if (!Validator.isObject(val) || toString.call(val) !== '[object File]') {
      return ['画像ファイルを選択してください'];
    }
    if (val.type.match(/^image/) == null) {
      return [`画像ファイルを選択してください(${val.name})`];
    }
    if (val.type.match(/^image/) !== null && !val.type.match(/^image\/(png|jpeg|gif)/)) {
      ret.push(`pngかjpegかgifを選択してください(${val.name})`);
    }
    return ret;
  }
};
