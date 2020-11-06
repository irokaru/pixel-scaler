import Validator from 'nonono-validator';

export default class ScaledImage {
  /**
   * @param {{base64: string, filename: string, type: string, scale: number}} params
   */
  constructor(params) {
    if (!this._validate(params)) {
      throw new Error('failed create scaled image' + JSON.stringify(params));
    }

    this.base64   = params.base64;
    this.filename = params.filename;
    this.type     = params.type;
    this.scale    = params.scale;
  }

  /**
   * バリデーションするやつ
   * @param {object} params
   * @returns {boolean}
   */
  _validate(params) {
    const rules = {
      base64: {
        type: 'string',
      },
      filename: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
      scale: {
        type: 'number',
        min : 100,
        max : 400,
      },
    };

    const v = (new Validator()).rules(params, rules);
    return v.exec();
  }
}
