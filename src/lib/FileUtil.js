import FileSaver from 'file-saver';

/**
 * ファイルを表示できる形式にするやつ
 * @param {Blob|MediaSource} blob
 * @returns {string}
 */
export const toShowable = (blob) => {
 return window.URL.createObjectURL(blob);
};

/**
 * validator for image file
 * @param {unknown} val
 * @return {string}
 */
export const isImageFile = (val) => {
  if (typeof val !== 'object' || Array.isArray(val) || toString.call(val) !== '[object File]') {
    return 'error-invalid-file';
  }

  if (!val.type.match(/^image\/(png|jpeg|gif)/)) {
    return 'error-invalid-image-type';
  }

  return '';
};

/**
 * validator for blob url
 * @param {string} url
 * @return {Promise<string>}
 */
export const existsUrlFile = async (url) => {
  try {
    await fetch(url);

    return '';
  } catch (e) {
    return 'error-invalid-url';
  }
};

/**
 * FileをImageDataに変換するやつ
 * @param {string} url
 * @param {number} width
 * @param {number} height
 * @param {number} scale (0-1)
 * @returns {Promise<ImageData>}
 */
export const fileToImageData = async (url, width, height, scale = 1) => {
  const canvas  = document.createElement('canvas');
  canvas.width  = width * scale;
  canvas.height = height * scale;
  const ctx     = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = () => {
      const scaledWidth  = parseInt(img.naturalWidth * scale);
      const scaledHeight = parseInt(img.naturalHeight * scale);

      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, scaledWidth, scaledHeight);
      resolve(ctx.getImageData(0, 0, scaledWidth, scaledHeight));
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};

/**
 * ImageDataをBase64に変換するやつ
 * @param {ImageData} imageData
 * @returns {string}
 */
export const imageDataToBase64 = (imageData) => {
  const canvas = document.createElement('canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
};

/**
 * ImageDataをリサイズするやつ
 * @param {ImageData} imageData
 * @param {number} width
 * @param {number} height
 * @param {boolean} imageSmoothingEnabled
 * @returns {Promise<ImageData>}
 */
export const resizeImageData = async (imageData, width, height, imageSmoothingEnabled = true) => {
  const resizeWidth  = width >> 0;
  const resizeHeight = height >> 0;

  const ibm     = await window.createImageBitmap(imageData, 0, 0, imageData.width, imageData.height);
  const canvas  = document.createElement('canvas');
  canvas.width  = resizeWidth;
  canvas.height = resizeHeight;

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = imageSmoothingEnabled;

  ctx.scale(resizeWidth / imageData.width, resizeHeight / imageData.height);
  ctx.drawImage(ibm, 0, 0);

  return ctx.getImageData(0, 0, resizeWidth, resizeHeight);
};

/**
 * Fileから縦横のサイズを返すやつ
 * @param {string} url
 * @returns {Promise<{width: number, height: number}>}
 */
export const getFileSize = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const size = {
        width : img.naturalWidth,
        height: img.naturalHeight,
      };

      resolve(size);
    };

    img.onerror = (err) => {
      reject(err);
    };

    img.src = url;
  });
};

/**
 * ダウンロードするやつ
 * @param {string|Blob} file
 * @param {string} name
 * @returns {void}
 */
export const download = (file, name) => {
  FileSaver.saveAs(file, name);
};

/**
 * transfer item を handle に変換するやつ
 * @param {DataTransferItem} item
 * @return {EntryFileHandle|FileSystemFileHandle|null}
 */
export const transferItemToHandle = async (item) => {
  // Using FileEntry if available
  if ('webkitGetAsEntry' in item) return new EntryFileHandle(await item.webkitGetAsEntry());
  // Fallback to File System Access API
  if ('getAsFileSystemHandle' in item) return await item.getAsFileSystemHandle();
  return null;
};

/**
 * FileHandle wrapper for regular files
 * @implements {FileSystemFileHandle}
 */
export class NativeFileHandle {
  /**
   * @param {Blob} file
   */
  constructor(file) {
    this._file = file;
  }

  async getFile() {
    return this._file;
  }
}

/**
 * FileHandle wrapper for FileSystemFileEntry
 * @implements {FileSystemFileHandle}
 */
export class EntryFileHandle {
  /**
   * @param {FileSystemFileEntry} entry
   */
  constructor(entry) {
    this._entry = entry;
  }

  async getFile() {
    return new Promise((resolve, reject) => {
      this._entry.file((file) => {
        resolve(file);
      },
      (e) => {
        reject(e);
      });
    });
  }
}
