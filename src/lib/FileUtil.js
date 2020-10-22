export default {
  /**
   * イベントからファイル配列を取り出す
   * @param {Event} e
   * @returns {FileList}
   */
  getFileListOnEvent(e) {
    return e.target.files || e.dataTransfer.files;
  },
};
