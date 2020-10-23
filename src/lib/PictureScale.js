import Validator from 'nonono-validator';

export default {
  /**
   * 拡大縮小するやつ
   * @param {File} file
   * @param {number} size
   * @return {File|boolean}
   */
  scale(file, size) {
    const rules = {
      file: {
        type: 'callback', callback: this._validateFile, name: 'ファイル',
      },
      size: {
        type: 'integer', min: 100, max: 300, name: '拡大率',
      },
    };

    const v = (new Validator()).rules({file: file, size: size}, rules);

    if (!v.exec()) {
      return false;
    }

    return {};
  },

  /**
   * ファイルのバリデーション
   * @param {unknown} val
   * @return {array}
   */
  _validateFile (val) {
    const ret = [];
    console.log(val);

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
