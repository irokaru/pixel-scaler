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
  async scale(file, scalePer, pixelSize) {
    const params = this._toParams(file, scalePer, pixelSize);

    if (!this._validate(params)) {
      return {
        status  : 'failed',
        messages: this._validate(params, true),
      };
    }

    const orgSize = await FileUtil.getFileSize(file);
    const scaled = await this._scale(file, orgSize, scalePer, pixelSize);

    return {
      status: 'success',
      image : new ScaledImage({
        base64  : FileUtil.imageDataToBase64(scaled),
        filename: file.name,
        type    : file.type,
        scale   : scalePer,
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
   * xBRを実行するやつ
   * @param {File} file
   * @param {{width: number, height: number}} orgSize
   * @param {number} scalePer (100-400)
   * @param {number} pixelSize (1-4)
   * @returns {Promise<ImageData>}
   */
  async _scale(file, orgSize, scalePer, pixelSize) {
    const orgSizeImageData = await FileUtil.fileToImageData(file, orgSize.width, orgSize.height, 1 / pixelSize);
    let array = new Uint32Array(orgSizeImageData.data.buffer);

    // for big pixel image
    if (pixelSize !== 1) {
      const scaleInt = this._getScaleInteger(pixelSize * 100);
      const toOrgSizeXbr = this._getXbr(scaleInt);
      console.log(orgSizeImageData.width, orgSizeImageData.height);
      array = toOrgSizeXbr(array, orgSizeImageData.width, orgSizeImageData.height);
    }

    const scaleInt = this._getScaleInteger(scalePer);
    const xbr = this._getXbr(scaleInt);
    const scaled = xbr(array, orgSize.width, orgSize.height);

    const imageData = new ImageData(new Uint8ClampedArray(scaled.buffer), orgSize.width * scaleInt, orgSize.height * scaleInt);
    return await FileUtil.resizeImageData(imageData, orgSize.width * scalePer / 100, orgSize.height * scalePer / 100);
  },

  /**
   * 倍率整数を返す
   * @param {number} size
   * @return {number}
   */
  _getScaleInteger(size) {
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
