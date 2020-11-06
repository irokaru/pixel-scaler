import JsZip from 'jszip';
import FileSaver from 'file-saver';

export default {
  /**
   * 画像たちをzipにするやつ
   * @param {array<ScaledImages>} imgs
   * @returns {Promise<any>}
   */
  async ScaledImagestoZip(imgs) {
    const zip = new JsZip();

    for (const [index, img] of Object.entries(imgs)) {
      zip.file(`img${index}.png`, img.split(',')[1], {base64: true});
    }

    return new Promise((resolve, reject) => {
      zip.generateAsync({type: 'blob'}).then(content => {
        resolve(content);
      }).catch(err => {
        reject(err);
      });
    });
  },

  download(file, name) {
    FileSaver.saveAs(file, name);
  }
}
