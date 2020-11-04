import FileReaderSync from './FileReaderSync';

export default {
  /**
   * イベントからファイル配列を取り出す
   * @param {Event} e
   * @returns {FileList}
   */
  getFileListOnEvent(e) {
    return e.target.files || e.dataTransfer.files;
  },

  /**
   * FileをImageDataに変換するやつ
   * @param {File}   file
   * @param {number} width
   * @param {number} height
   * @returns {ImageData}
   */
  async fileToImageData(file, width, height) {
    const blob = await (new FileReaderSync()).readAsDataURL(file);

    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src   = blob;

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, width, height));
      };

      img.onerror = (err) => {
        reject(err);
      };
    });
  },

  /**
   *
   * @param {ImageData} imageData
   * @returns {Image}
   */
  imageDataToImage(imageData) {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
  },

  /**
   * BlobをArrayBufferに変換するやつ
   * @param {Blob} blob
   * @returns {Promise<any>}
   */
  async blobToArrayBuffer(blob) {
    return await new FileReaderSync().readAsArrayBuffer(blob);
  },

  /**
   * Fileから縦横のサイズを返すやつ
   * @param {File} file
   * @returns {object}
   */
  async getFileScaleSize(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const size = {
          width : img.naturalWidth,
          height: img.naturalHeight,
        };

        URL.revokeObjectURL(img.src);
        resolve(size);
      };

      img.onerror = (err) => {
        reject(err);
      };

      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * ArrayBufferをUint8Arrayに変換するやつ
   * @param {ArrayBuffer} arrayBuffer
   * @returns {Uint8Array}
   */
  arrayBufferToUint8Array (arrayBuffer) {
    return new Uint8Array(arrayBuffer);
  },

  /**
   * ArrayBufferをUint16Arrayに変換するやつ
   * @param {ArrayBuffer} arrayBuffer
   * @returns {Uint16Array}
   */
  arrayBufferToUint16Array (arrayBuffer) {
    return new Uint16Array(arrayBuffer);
  },

  /**
   * ArrayBufferをUint32Arrayに変換するやつ
   * @param {ArrayBuffer} arrayBuffer
   * @returns {Uint32Array}
   */
  arrayBufferToUint32Array (arrayBuffer) {
    return new Uint32Array(arrayBuffer);
  },

  /**
   * Uint32ArrayをArrayBufferに変換するやつ
   * @param {Uint32Array} uint32Array
   * @returns {ArrayBuffer}
   */
  uint32ArrayToArrayBuffer (uint32Array) {
    const arrayBuffer = new ArrayBuffer(uint32Array.length * 4);
    const view = new Uint32Array(arrayBuffer);

    for (let i = 0, len = uint32Array.length; i < len; ++i) {
      view[i] = uint32Array[i];
    }

    return arrayBuffer;
  },

  /**
   * TypedArrayをBlobに変換するやつ
   * @param {Uint8Array|Uint16Array|Uint32Array} typedArray
   * @returns {Blob}
   */
  typedArrayToBlob (typedArray, mimeType) {
    return new Blob(typedArray, {type: mimeType});
  },
};
