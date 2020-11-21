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
              <li>出てきたピクチャかZIPダウンロードボタンをクリックしてピクチャを保存</li>
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

              <Loading v-if="flags.convert"/>

            </div>

            <image-container class="margin-tb-1" v-for="img in converted" :key="img.image.filename"
                             :original="img.original" :converted="img.image"/>

          </template>

        </div>

      </div>

      <link-container class="margin-tb-4" v-if="isWeb()"/>

      <version-container class="margin-tb-4"
                         v-if="isElectron() && flags.showVersionContainer"
                         @close="flags.showVersionContainer = false"
                         :checkUpdate="flags.checkUpdate" :isLatest="isLatest()" :latestVersion="latestVersion"/>

    </main>

    <footer v-if="isWeb()">
      (C) 2020 ののの茶屋.
    </footer>
  </div>
</template>

<script>
import Archive      from './lib/Archive';
import FileUtil     from './lib/FileUtil';
import PictureScale from './lib/PictureScale';
import System       from './lib/System';
import Version      from './lib/Version';

import Loading          from './components/Loading';
import ImageContainer   from './components/ImageContainer.vue';
import LinkContainer    from './components/LinkContainer';
import VersionContainer from './components/VersionContainer';

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
      latestVersion: '',
      flags    : {
        convert: false,
        checkUpdate: false,
        showVersionContainer: true,
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
          this.flags.convert = false;
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
     * zipをダウンロードするやつ
     * @returns {void}
     */
    download() {
      if (this.flags.convert) {
        return;
      }

      Archive.download(this.zip, 'images.zip');
    },

    /**
     * コンバート関連変数の初期化
     * @returns {void}
     */
    resetConverted() {
      if (this.flags.convert) {
        return;
      }

      this.files     = [];
      this.converted = [];
      this.errors    = [];
      this.zip       = null;
    },

    /**
     * 現在が最新版かどうか
     * @returns {boolean}
     */
    isLatest() {
      return this.flags.checkUpdate && this.latestVersion !== '';
    },

    /**
     * ウェブかどうか
     * @returns {boolean}
     */
    isWeb () {return System.isWeb()},

    /**
     * electronかどうか
     * @returns {boolean}
     */
    isElectron() {return System.isElectron()},

    /**
     * バージョンアップが必要かどうか
     * @returns {string}
     */
    checkUpdate() {return Version.check()},
  },
  async created () {
    if (this.isElectron()) {
      this.latestVersion = await this.checkUpdate();
      this.flags.checkUpdate = true;
    }
  },
  components: {
    Loading,
    ImageContainer,
    LinkContainer,
    VersionContainer,
  },
}
</script>
