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
   * ImageDataをBase64に変換するやつ
   * @param {ImageData} imageData
   * @returns {Image}
   */
  imageDataToBase64(imageData) {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
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
};
