import System from './System';

export default {
  /**
   * 最新版かどうかを返す。最新版だったらから文字が、そうでなければその最新版の番号が出る
   * @returns {Promise<string>}
   */
  async check() {
    const vers = await this._getVersions();

    return this._compare(System.version(), vers[0].name) ? vers[0].name : '';
  },

  /**
   * 最新バージョンをとってくる
   * @returns {Promise<Response>}
   */
  _getVersions() {
    return fetch('https://api.github.com/repos/irokaru/pixel-scaler/tags')
            .then(response => {
              return response.ok ? response.json() : [{name: ''}];
            })
            .catch(() => [{name: ''}]);
  },

  /**
   * 現在バージョンが最新だったらtrueが返る
   * @param {string} now
   * @param {string} target
   * @returns {boolean}
   */
  _compare(now, target) {
    now    = this._parge(now);
    target = this._parge(target);
    return now < target;
  },

  /**
   * バージョン番号を数字にして返す
   * @param {string} verStr
   * @returns {number}
   */
  _parge(verStr) {
    const regex = new RegExp('\\.', 'g');
    return Number(verStr.replace(regex, ''));
  },
};
