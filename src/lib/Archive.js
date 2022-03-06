import JsZip from 'jszip';
import FileSaver from 'file-saver';

/**
 * 画像たちをzipにするやつ
 * @param {{base64: string, filename: string}[]} imgs
 * @returns {Promise<Blob|any>}
 */
export const scaledImagesToZip = async (imgs) => {
  const zip = new JsZip();

  for (const img of imgs) {
    zip.file(img.filename, img.base64.split(',')[1], {base64: true});
  }

  return new Promise((resolve, reject) => {
    zip.generateAsync({type: 'blob'}).then(content => {
      resolve(content);
    }).catch(err => {
      reject(err);
    });
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
