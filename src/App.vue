<template>
  <div class="wrapper">
    <main>
      <h1>ぴくせる すけゐらぁ</h1>

      <nav>
        <input class="col" type="number" v-model.number="size" min="100" max="400" placeholder="拡大率">

        <label class="col-big box circle hover active pointer" @dragover.prevent @drop.prevent="setFiles">
          <input type="file" accept="image/png, image/jpeg, image/gif" multiple @change="setFiles">
          <v-fa :icon="['far', 'file-image']"/> {{files.length ? `${files.length}件のファイルを選択中` : 'ピクチャを選択(gif/jpeg/png)'}}
        </label>

        <div class="col box circle hover active pointer" @click="convert">
          <v-fa icon="reply" flip="vertical"/> 変換
        </div>
      </nav>

      <div class="content margin-tb-1">

        <div class="box block margin-tb-2" v-show="errors.length !== 0">
          <v-fa icon="times-circle" class="close-btn pointer" @click="errors = []"/>
          <ul>
            <li v-for="error in errors" :key="error.id">{{error}}</li>
          </ul>
        </div>

        <div class="box block">
          <template v-if="exception">
            <v-fa icon="times-circle" class="close-btn pointer" @click="exception = null"/>
            <p>エラーが発生しました。作った人に下記のテキストを送りつけてください。</p>
            <pre class="box-reverse block selectable-all">{{exception}}</pre>
          </template>

          <template v-else-if="converted.length === 0">
            <h2>つかいかた</h2>
            <ol>
              <li>左の数字入力欄から<strong>拡大率(100～400%)</strong>を設定する</li>
              <li>ピクチャを選択ボタンをクリックして<strong>ピクチャを選ぶ</strong></li>
              <li><strong>変換ボタン</strong>をクリックする</li>
              <li>イラスト調で拡大されたピクチャが出てくる</li>
              <li>幸せ！</li>
            </ol>
            <p>※変換元ピクチャの縦横サイズが大きすぎたら変換後ピクチャの一部が途切れます（現在原因究明中…）</p>

            <h2 class="margin-t-2">Tips</h2>
            <ul>
              <li>解像度の低いイラスト(ドット絵ではない)はキレイに拡大されません</li>
              <li>拡大率を100%に指定することでドット絵にアンチエイリアスをかけることができます</li>
            </ul>
          </template>

          <template v-else>
            <div class="btn-list">
              <div class="col box circle hover active pointer margin-lr-1" @click="download">
                <v-fa :icon="['far', 'file-archive']"/> ZIPダウンロード
              </div>
              <div class="col box circle hover active pointer margin-lr-1" @click="resetConverted">
                <v-fa icon="eraser"/> リセット
              </div>
            </div>

            <div class="box-reverse block margin-tb-1 scroll" v-for="img in converted" :key="img.image.filename">
              <div class="center">
                <img :src="toShowable(img.original)">

                <v-fa icon="arrow-down" class="margin-tb-2 big"/>

                <a :href="img.image.base64" :download="img.image.filename">
                  <img :src="img.image.base64">
                </a>
              </div>
            </div>
          </template>

        </div>

      </div>

      <div class="margin-tb-4">
        <a href="https://twitter.com/intent/tweet?text=%E3%81%B4%E3%81%8F%E3%81%9B%E3%82%8B%20%E3%81%99%E3%81%91%E3%82%90%E3%82%89%E3%81%81&hashtags=%E3%81%B4%E3%81%8F%E3%81%9B%E3%82%8B%E3%81%99%E3%81%91%E3%82%90%E3%82%89%E3%81%81&url=https://irokaru.github.io/pixel-scaler/" target="_blank" class="box circle margin-lr-1 hover active">
          <v-fa :icon="['fas', 'share-alt-square']"/> <v-fa :icon="['fab', 'twitter']"/> 共有
        </a>

        <a href="https://twitter.com/irokaru" target="_blank" class="box circle margin-lr-1 hover active">
          <v-fa :icon="['fab', 'twitter']"/> 作った人
        </a>

        <a href="https://github.com/irokaru/pixel-scaler" target="_blank" class="box circle margin-lr-1 hover active">
          <v-fa :icon="['fab', 'github']"/> リポジトリ
        </a>
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
