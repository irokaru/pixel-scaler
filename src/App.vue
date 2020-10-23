<template>
  <div id="app">
    <main>
      <h1>ドット絵をいい感じにリサイズするやつ</h1>

      <nav>
        <input type="number" v-model.number="size" min="100" max="300" placeholder="拡大率">

        <label class="box circle hover active">
          <input type="file" accept="image/png, image/jpeg, image/gif" multiple @change="setFiles">
          <i class="far fa-file-image"></i> {{files.length ? `${files.length}件のファイルが選択中` : 'ピクチャを選択'}}
        </label>

        <div class="box circle hover active" @click="convert">変換</div>
      </nav>
    </main>

    <footer>
      (C) 2020 ののの茶屋.
    </footer>
  </div>
</template>

<script>
import FileUtil     from './lib/FileUtil';
import PictureScale from './lib/PictureScale';

export default {
  name: 'app',
  data () {
    return {
      size: 100,
      files: [],
      converted: [],
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

    /**
     * 実際に拡大縮小するやつ
     * @returns {void}
     */
    convert() {
      this.converted = [];

      for (const file of this.files) {
        PictureScale.scale(file, this.size);
        // TODO convert
      }
    }
  },
}
</script>

<style>
</style>
