<template>
<div class="wrapper">
  <div class="container">

    <main>
      <h1>{{$t('title')}}</h1>

      <nav>
        <div class="row margin-b-1">
          <div class="col">
            <div class="top-label"><v-fa :icon="['fas', 'th']"/> {{$t('original-pixel-size')}}</div>
            <label class="radio box hover active flex-grow-1" :class="{on: pixelSize.org == pixel}" v-for="pixel in pixelSize.list" :key="pixel">
              <input type="radio" v-model.number="pixelSize.org" :value="pixel"> {{pixel}}px
            </label>
          </div>

          <div class="col">
            <div class="top-label"><v-fa :icon="['fas', 'search-plus']"/> {{$t('scale')}}(%)</div>
            <input class="flex-grow-1" type="number" inputmode="decimal" v-model.number="scale" step="5" min="100" max="400" :placeholder="$t('scale')">
          </div>
        </div>

        <div class="row margin-tb-2">
          <div class="col margin-tb-1">
            <label class="box circle hover active pointer flex-grow-1 margin-tb-1" @dragover.prevent @drop.prevent="setFiles">
              <input type="file" accept="image/png, image/jpeg, image/gif" multiple @change="setFiles">
              <v-fa :icon="['far', 'file-image']"/> {{files.length ? $t('select', {count: files.length}) : $t('no-select')}}
            </label>
          </div>

          <div class="col margin-tb-1">
            <div class="box circle hover active pointer flex-grow-1 margin-tb-1" @click="convert">
              <v-fa icon="reply" flip="vertical"/> {{$t('convert')}}
            </div>
          </div>
        </div>
      </nav>

      <div class="content margin-tb-1">

        <attention-container v-if="flags.showAttention" @close="flags.showAttention = false"/>

        <div class="box block margin-tb-2" v-show="errors.length !== 0">
          <v-fa icon="times-circle" class="close-btn pointer" @click="errors = []"/>
          <ul>
            <li v-for="error in errors" :key="error.id">{{$t(error.message, {filename: error.org.name ?? '???'}) }}</li>
          </ul>
        </div>

        <template v-if="exception">
          <div class="box block">
            <exception-container @close="exception = null"
                                :exception="exception"/>
          </div>
        </template>

        <template v-else-if="converted.length === 0">
          <div class="box block">
            <howto-container />
          </div>
        </template>

        <template v-else>
          <div class="box block btn-list margin-tb-2">
            <div class="col box circle hover active pointer margin-1" @click="downloadZip">
              <v-fa :icon="['far', 'file-archive']"/> {{$t('download-zip')}}
            </div>
            <div class="col box circle hover active pointer margin-1" @click="resetConverted">
              <v-fa icon="eraser"/> {{$t('reset')}}
            </div>

            <Loading v-if="flags.convert"/>

          </div>

          <div class="grid-list">
            <image-container class="margin-tb-1"
                  v-for="(img, index) in converted" :key="img.image.filename"
                  :org="img.org" :converted="img.image"
                  @close="deleteConverted(index)" @preview="setPreviewConverted(index)"/>
          </div>
        </template>

      </div>

      <language-container @lang="setLang"/>

      <color-container @color="setColor"/>

      <link-container class="margin-tb-4" v-if="isWeb()"/>

      <version-container class="margin-tb-4"
                         v-if="isElectron() && flags.showVersionContainer"
                         @close="flags.showVersionContainer = false"
                         :checkUpdate="flags.checkUpdate" :isLatest="isLatest()" :latestVersion="latestVersion"/>

    </main>

    <footer v-if="isWeb()">
      (C) {{year()}} ののの茶屋.
    </footer>

    <transition name="fade">
      <preview-conteiner v-if="flags.showPreviewConverted"
                         :image="previewConverted"
                         @close="flags.showPreviewConverted = false"/>
    </transition>

  </div>
</div>
</template>

<script>
import {scaledImagesToZip} from './lib/Archive';
import {getFileListOnEvent, download} from './lib/FileUtil';
import {isWeb, isElectron} from './lib/System';
import Version  from './lib/Version';

import {getDefaultColorValues, setDefaultColorKey} from './colors/color';
import {setDefaultLanguage} from './i18n/lang';

import PictureScale from './controllers/PictureScale';

import Loading            from './components/Loading.vue';
import AttentionContainer from './components/AttentionContainer.vue';
import HowtoContainer     from './components/HowtoContainer.vue';
import ImageContainer     from './components/ImageContainer.vue';
import LanguageContainer  from './components/LanguageContainer.vue';
import ColorContainer     from './components/ColorContainer.vue';
import LinkContainer      from './components/LinkContainer.vue';
import VersionContainer   from './components/VersionContainer.vue';
import ExceptionContainer from './components/ExceptionContainer.vue';
import PreviewConteiner   from './components/PreviewContainer.vue';

export default {
  name: 'app',
  data () {
    return {
      pixelSize: {
        list: [1, 2, 3, 4],
        org: 1,
      },
      scale: 200,
      files: [],
      converted: [],
      errors: [],
      exception: null,
      latestVersion: '',
      previewConverted: '',
      flags: {
        convert: false,
        checkUpdate: false,
        showAttention: true,
        showVersionContainer: true,
        showPreviewConverted: false,
      },
      color: getDefaultColorValues(),
    };
  },
  methods: {
    /**
     * ファイル配列を変数に入れるやつ
     * @param {Event} e
     * @returns {void}
     */
    setFiles(e) {
      this.files = getFileListOnEvent(e);

      this.exception = '';
    },

    /**
     * 実際に拡大縮小するやつ
     * @returns {void}
     */
    async convert() {
      this.exception = '';

      [this.pixel, this.scale] = PictureScale.adjustParams(this.pixel, this.scale);

      if (this.flags.convert || this.files.length === 0) {
        return;
      }

      this.flags.convert = true;

      for (const file of this.files) {
        await PictureScale.scale(file, this.scale, this.pixelSize.org).then(result => {
          if (result.status === 'success') {
            this.converted.push(result);
          } else {
            this.errors.push(result);
          }
        }).catch(e => {
          this.exception = e;
        });

        if (this.exception) {
          this.flags.convert = false;
          return;
        }
      }

      this.flags.convert = false;
    },

    /**
     * ZIPを作るやつ
     */
    async createZip() {
      const files = this.converted.map(converted => converted.image);

      try {
        return await scaledImagesToZip(files);
      } catch (e) {
        this.exception = e;
        return false;
      }
    },

    /**
     * zipをダウンロードするやつ
     * @returns {void}
     */
    async downloadZip() {
      if (this.flags.convert) return;

      this.flags.convert = true;

      const zip = await this.createZip();

      this.flags.convert = false;

      if (!zip) return;

      download(zip, 'images.zip');
    },

    /**
     * コンバートから1件消す
     */
    deleteConverted(index) {
      this.converted.splice(index, 1);
    },

    setPreviewConverted(index) {
      const target = this.converted[index];

      if (!target) return;

      this.previewConverted = target.image.base64;
      this.flags.showPreviewConverted = true;
    },

    /**
     * コンバート関連変数の初期化
     * @returns {void}
     */
    resetConverted() {
      if (this.flags.convert) return;

      this.files     = [];
      this.converted = [];
      this.errors    = [];
    },

    /**
     * 色を設定する
     * @param {object}
     * @returns {void}
     */
    setColor(name, color) {
      if (!setDefaultColorKey(name)) return;
      this.color = color;
    },

    /**
     * 言語を設定する
     * @param {string}
     * @returns {void}
     */
    setLang(lang) {
      if (!setDefaultLanguage(lang)) return;
      this.$i18n.locale = lang;
      document.title    = this.$t('title');
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
    isWeb () {return isWeb()},

    /**
     * electronかどうか
     * @returns {boolean}
     */
    isElectron() {return isElectron()},

    /**
     * バージョンアップが必要かどうか
     * @returns {Promise<string>}
     */
    checkUpdate() {return Version.check()},

    /**
     * 今年の年を返す
     * @returns {number}
     */
    year() {return (new Date()).getFullYear();}
  },
  async created () {
    document.title = this.$t('title');

    if (this.isElectron()) {
      this.latestVersion = await this.checkUpdate();
      this.flags.checkUpdate = true;
    }
  },
  components: {
    Loading,
    AttentionContainer,
    HowtoContainer,
    ImageContainer,
    LanguageContainer,
    ColorContainer,
    LinkContainer,
    VersionContainer,
    ExceptionContainer,
    PreviewConteiner,
  },
}
</script>

<style lang="scss">
$font: v-bind('color.font');
$background: v-bind('color.background');
$edge-bright: v-bind('color.edgeBright');
$edge-shadow: v-bind('color.edgeShadow');
$scrollbar-background: v-bind('color.scrollbarBackground');
$scrollbar-shadow: v-bind('color.scrollbarShadow');
$scrollbar-thumb: v-bind('color.scrollbarThumb');

@import './assets/scss/global.scss';
</style>
