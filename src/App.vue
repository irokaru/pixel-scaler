<template>
  <div id="app">
    <main>
      <h1>ドット絵をいい感じにリサイズするやつ</h1>

      <nav>
        <input class="col" type="number" v-model.number="size" min="100" max="400" placeholder="拡大率">

        <label class="col-big box circle hover active pointer">
          <input type="file" accept="image/png, image/jpeg, image/gif" multiple @change="setFiles">
          <i class="far fa-file-image"></i> {{files.length ? `${files.length}件のファイルが選択中` : 'ピクチャを選択'}}
        </label>

        <div class="col box circle hover active pointer" @click="convert">
          <i class="fas fa-reply fa-flip-vertical"></i> 変換
        </div>
      </nav>

      <div class="content">
        <template v-if="converted.length === 0">
          <ol>
            <li>左の数字入力欄から<strong>拡大率</strong>を設定する</li>
            <li>ピクチャを選択ボタンをクリックして<strong>ピクチャを選ぶ</strong></li>
            <li><strong>変換ボタン</strong>をクリックする</li>
            <li>拡大されたピクチャが出てくる</li>
            <li>幸せ！</li>
          </ol>
        </template>

        <template v-else>
          <div class="original">
            <h3>元のサイズ</h3>
            <img :src="image" v-for="image in toShowable(files)" :key="image.id">
          </div>

          <div class="scaled">
            <h3>拡大後({{size}}%)</h3>
            <!-- TODO: ZIPダウンロードボタン -->
            <img :src="image" v-for="image in converted" :key="image.id">
          </div>
        </template>
      </div>
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
    async convert() {
      this.converted = [];

      for (const file of this.files) {
        const scaled = await PictureScale.scale(file, this.size);
        this.converted.push(scaled);
      }
    },

    /**
     * ファイル配列を表示できる形式にするやつ
     * @param {array} files
     * @returns {array}
     */
    toShowable(files) {
      const list = [];

      for (const file of files) {
        list.push(window.URL.createObjectURL(file));
      }

      return list;
    },
  },
}
</script>

<style>
</style>
