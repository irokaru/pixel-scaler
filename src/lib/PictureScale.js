import FileUtil  from './FileUtil';
import Validator from 'nonono-validator';
import {xbr2x, xbr3x, xbr4x} from 'xbr-js';
import ScaledImage from './ScaledImage';

export default {
  /**
   * 拡大縮小するやつ
   * @param {File} file
   * @param {number} size
   * @return {ScaledImage|boolean}
   */
  async scale(file, size) {
    const params = this._toParams(file, size);

    if (!this.validate(params)) {
      throw this.validate(params, true);
    }

    const scale = await FileUtil.getFileScaleSize(file);

    const originalImageData = await FileUtil.fileToImageData(file, scale.width, scale.height);
    const originalPixelView = new Uint32Array(originalImageData.data.buffer);

    const sizeInt = this._getSizeInteger(size);
    const xbr     = this._getXbr(sizeInt);
    const scaled  = xbr(originalPixelView, scale.width, scale.height);

    const imageData = new ImageData(new Uint8ClampedArray(scaled.buffer), scale.width * sizeInt, scale.height * sizeInt);
    const resized   = await FileUtil.resizeImageData(imageData, scale.width * size / 100, scale.height * size / 100);

    return new ScaledImage({
      base64  : FileUtil.imageDataToBase64(resized),
      filename: file.name,
      type    : file.type,
      scale   : size,
    });
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
   * @returns {object}
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
   * @returns {object}
   */
  _toParams (file, size) {
    return {
      file: file,
      size: size,
    };
  },

  /**
   * バリデーション
   * @param {object} params
   * @param {boolean} errors
   * @returns {boolean}
   */
  validate(params, errors = false) {
    const rules = {
      file: {
        type: 'callback', callback: this._validateFile, name: 'ファイル',
      },
      size: {
        type: 'integer', min: 100, max: 400, name: '拡大率',
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
