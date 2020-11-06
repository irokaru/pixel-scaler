<template>
  <div class="wrapper">
    <main>
      <h1>ぴくせる すけゐらぁ</h1>

      <nav>
        <input class="col" type="number" v-model.number="size" min="100" max="400" placeholder="拡大率">

        <label class="col-big box circle hover active pointer">
          <input type="file" accept="image/png, image/jpeg, image/gif" multiple @change="setFiles">
          <i class="far fa-file-image"></i> {{files.length ? `${files.length}件のファイルを選択中` : 'ピクチャを選択(gif/jpeg/png)'}}
        </label>

        <div class="col box circle hover active pointer" @click="convert">
          <i class="fas fa-reply fa-flip-vertical"></i> 変換
        </div>
      </nav>

      <div class="content">

        <div class="box block margin-tb" v-show="errors.length !== 0">
          <i class="fas fa-times-circle close-btn pointer" @click="errors = []"></i>
          <ul>
            <li v-for="error in errors" :key="error.id">{{error}}</li>
          </ul>
        </div>

        <div class="box block">
          <template v-if="exception">
            <i class="fas fa-times-circle close-btn pointer" @click="exception = null"></i>
            <p>エラーが発生しました。作った人に下記のテキストを送りつけてください。</p>
            <pre class="box-reverse block selectable-all">{{exception}}</pre>
          </template>

          <template v-else-if="converted.length === 0">
            <ol>
              <li>左の数字入力欄から<strong>拡大率(%)</strong>を設定する</li>
              <li>ピクチャを選択ボタンをクリックして<strong>ピクチャを選ぶ</strong></li>
              <li><strong>変換ボタン</strong>をクリックする</li>
              <li>拡大されたピクチャが出てくる</li>
              <li>幸せ！</li>
            </ol>
            <p>※ピクチャの縦横サイズが大きすぎたら変換に失敗します</p>
          </template>

          <template v-else>
            <div class="btn-list">
              <div class="col box circle hover active pointer margin-lr" @click="download">
                <i class="far fa-file-archive"></i> ZIPダウンロード
              </div>
              <div class="col box circle hover active pointer margin-lr" @click="resetConverted">
                <i class="fas fa-eraser"></i> リセット
              </div>
            </div>

            <div class="box-reverse block margin-tb scroll" v-for="img in converted" :key="img.image.filename">
              <div class="center">
                <img :src="toShowable(img.original)">

                <i class="fas fa-arrow-down margin-tb block big"></i>

                <a :href="img.image.base64" :download="img.image.filename">
                  <img :src="img.image.base64">
                </a>
              </div>
            </div>
          </template>

        </div>

      </div>
    </main>

    <footer>
      (C) 2020 ののの茶屋.
    </footer>
  </div>
</template>

<script>
import Archive      from './lib/Archive';
import FileUtil     from './lib/FileUtil';
import PictureScale from './lib/PictureScale';

export default {
  name: 'app',
  data () {
    return {
      size     : 200,
      files    : [],
      converted: [],
      errors   : [],
      zip      : null,
      exception: null,
      flags    : {
        convert: false,
      },
    };
  },
  methods: {
    /**
     * ファイル配列を変数に入れるやつ
     * @param {Event} e
     * @returns {void}
     */
    setFiles(e) {
      this.files = FileUtil.getFileListOnEvent(e);

      this.converted = [];
      this.zip       = null;
      this.exception = null;
    },

    /**
     * 実際に拡大縮小するやつ
     * @returns {void}
     */
    async convert() {
      this.converted = [];
      this.errors    = [];
      this.exception = null;
      this.size      = PictureScale.adjustSize(this.size);

      if (this.flags.convert || this.files.length === 0) {
        return;
      }

      this.flags.convert = true;

      for (const file of this.files) {
        await PictureScale.scale(file, this.size).then(scaled => {
          if (scaled.status === 'success') {
            this.converted.push(scaled);
          } else {
            for (const err of Object.values(scaled.messages)) {
              this.errors = this.errors.concat(err);
            }
          }
        }).catch(e => {
          this.exception = e;
        });

        if (this.exception) {
          return;
        }
      }

      const files = [];

      for (const scaled of this.converted) {
        files.push(scaled.image);
      }

      await Archive.ScaledImagestoZip(files).then(content => {
        this.zip = content;
      }).catch(e => {
        this.exception = e;
      });

      this.flags.convert = false;
    },

    /**
     * ファイルを表示できる形式にするやつ
     * @param {Blob} files
     * @returns {string}
     */
    toShowable(blob) {
      return FileUtil.toShowable(blob);
    },

    /**
     * zipをダウンロードするやつ
     * @returns {void}
     */
    download() {
      Archive.download(this.zip, 'images.zip');
    },

    resetConverted() {
      this.files     = [];
      this.converted = [];
      this.errors    = [];
      this.zip       = null;
    }
  },
}
</script>

<style>
</style>
