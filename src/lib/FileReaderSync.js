export default class FileReaderSync extends FileReader {
  constructor() {
    super();
  }

  _readAs(blob, ctx) {
    return new Promise((res, rej) => {
      super.addEventListener('load', ({target}) => res(target.result));
      super.addEventListener('error', ({target}) => rej(target.error));
      super[ctx](blob);
    });
  }

  readAsArrayBuffer(blob) {
    return this._readAs(blob, 'readAsArrayBuffer');
  }

  readAsDataURL(blob) {
    return this._readAs(blob, 'readAsDataURL');
  }

  readAsText(blob) {
    return this._readAs(blob, 'readAsText');
  }
}
