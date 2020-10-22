<template>
  <div id="app">
    <main>
      <h1>ドット絵のサイズをいい感じにリサイズするやつ</h1>

      <input type="number" min="1" placeholder="拡大率">

      <label class="box circle hover active">
        <input type="file" accept="image/png, image/jpeg, image/gif" multiple @change="setFiles">
        <i class="far fa-file-image"></i> {{files.length ? `${files.length}件のファイルが選択中` : 'ピクチャを選択'}}
      </label>
    </main>

    <footer>
      (C) 2020 ののの茶屋.
    </footer>
  </div>
</template>

<script>
import FileUtil from './lib/FileUtil';

export default {
  name: 'app',
  data () {
    return {
      files: [],
    };
  },
  methods: {
    /**
     * ファイル配列を変数に入れるやつ
     * @returns {void}
     */
    setFiles(e) {
      this.files = FileUtil.getFileListOnEvent(e);
    },
  },
}
</script>

<style>
</style>
