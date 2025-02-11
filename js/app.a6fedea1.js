/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2304:
/***/ (function() {

if (!('createImageBitmap' in window)) {
  window.createImageBitmap = async function (data) {
    return new Promise(resolve => {
      let dataURL;
      if (data instanceof Blob) {
        dataURL = URL.createObjectURL(data);
      } else if (data instanceof ImageData) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = data.width;
        canvas.height = data.height;
        ctx.putImageData(data, 0, 0);
        dataURL = canvas.toDataURL();
      } else {
        throw new Error('createImageBitmap does not handle the provided image source type');
      }
      const img = document.createElement('img');
      img.addEventListener('load', function () {
        resolve(this);
      });
      img.src = dataURL;
    });
  };
}

/***/ }),

/***/ 8062:
/***/ (function(__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
var runtime_dom_esm_bundler = __webpack_require__(3751);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.flags.js
var es_regexp_flags = __webpack_require__(8802);
// EXTERNAL MODULE: ./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
var runtime_core_esm_bundler = __webpack_require__(641);
// EXTERNAL MODULE: ./node_modules/@vue/shared/dist/shared.esm-bundler.js
var shared_esm_bundler = __webpack_require__(33);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=template&id=75d5146f


const _hoisted_1 = {
  class: "wrapper"
};
const _hoisted_2 = {
  class: "container"
};
const _hoisted_3 = {
  key: 0
};
const _hoisted_4 = ["alt"];
const _hoisted_5 = {
  key: 1
};
const _hoisted_6 = {
  class: "row margin-b-1"
};
const _hoisted_7 = {
  class: "col"
};
const _hoisted_8 = {
  class: "top-label"
};
const _hoisted_9 = {
  class: "col"
};
const _hoisted_10 = {
  class: "top-label"
};
const _hoisted_11 = {
  class: "col"
};
const _hoisted_12 = {
  class: "top-label"
};
const _hoisted_13 = ["placeholder"];
const _hoisted_14 = {
  class: "row margin-tb-2"
};
const _hoisted_15 = {
  class: "col margin-tb-1"
};
const _hoisted_16 = {
  class: "col margin-tb-1"
};
const _hoisted_17 = {
  class: "content margin-tb-1"
};
const _hoisted_18 = {
  class: "box block margin-tb-2"
};
const _hoisted_19 = {
  key: 1,
  class: "box block"
};
const _hoisted_20 = {
  key: 2,
  class: "box block"
};
const _hoisted_21 = {
  class: "box block btn-list margin-tb-2"
};
const _hoisted_22 = {
  class: "grid-list"
};
const _hoisted_23 = {
  key: 0
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_fa = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("v-fa");
  const _component_form_radio = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("form-radio");
  const _component_form_file_input = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("form-file-input");
  const _component_attention_container = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("attention-container");
  const _component_exception_container = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("exception-container");
  const _component_howto_container = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("howto-container");
  const _component_LoadingPart = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("LoadingPart");
  const _component_image_container = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("image-container");
  const _component_language_container = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("language-container");
  const _component_color_container = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("color-container");
  const _component_link_container = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("link-container");
  const _component_version_container = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("version-container");
  const _component_preview_container = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("preview-container");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", _hoisted_1, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_2, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("main", null, [$options.isUnite() ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("h1", _hoisted_3, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
    src: "/banner.png",
    alt: _ctx.$t('title'),
    onselectstart: "return false;",
    onmousedown: "return false;",
    oncontextmenu: "return false;"
  }, null, 8, _hoisted_4)])) : ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("h1", _hoisted_5, (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('title')), 1)), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("nav", null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_6, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_7, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_8, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['fas', 'th']
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('original-pixel-size')), 1)]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_form_radio, {
    modelValue: $data.zoom.org,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => $data.zoom.org = $event),
    modelModifiers: {
      number: true
    },
    name: "original-pixel-mode",
    options: $data.zoom.list
  }, null, 8, ["modelValue", "options"])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_9, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_10, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['fas', 'terminal']
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('scale-mode')), 1)]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_form_radio, {
    modelValue: $data.scaleMode,
    "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => $data.scaleMode = $event),
    name: "scale-mode",
    options: $data.scaleModes,
    trans: true
  }, null, 8, ["modelValue", "options"])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_11, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_12, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['fas', 'search-plus']
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('scale')) + "(%)", 1)]), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    class: "flex-grow-1",
    type: "number",
    inputmode: "decimal",
    "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => $data.scale = $event),
    step: "5",
    min: "100",
    max: "800",
    placeholder: _ctx.$t('scale')
  }, null, 8, _hoisted_13), [[runtime_dom_esm_bundler/* vModelText */.Jo, $data.scale, void 0, {
    number: true
  }]])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_14, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_15, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_form_file_input, {
    onFilechange: $options.setFiles
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
      icon: ['far', 'file-image']
    }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)($data.fileHandles.length ? _ctx.$t('select', {
      count: $data.fileHandles.length
    }) : _ctx.$t('no-select')), 1)]),
    _: 1
  }, 8, ["onFilechange"])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_16, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: "box circle hover active pointer flex-grow-1 margin-tb-1",
    onClick: _cache[3] || (_cache[3] = (...args) => $options.convert && $options.convert(...args))
  }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: "reply",
    flip: "vertical"
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('convert')), 1)])])])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_17, [$data.flags.showAttention ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(_component_attention_container, {
    key: 0,
    onClose: _cache[4] || (_cache[4] = $event => $data.flags.showAttention = false)
  })) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), (0,runtime_core_esm_bundler/* withDirectives */.bo)((0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_18, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: "times-circle",
    class: "close-btn pointer",
    onClick: _cache[5] || (_cache[5] = $event => $data.errors = [])
  }), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", null, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($data.errors, error => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", {
      key: error.id
    }, (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t(error.message, {
      filename: error.org.name ?? '???'
    })), 1);
  }), 128))])], 512), [[runtime_dom_esm_bundler/* vShow */.aG, $data.errors.length !== 0]]), $data.exception ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", _hoisted_19, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_exception_container, {
    onClose: _cache[6] || (_cache[6] = $event => $data.exception = null),
    exception: $data.exception
  }, null, 8, ["exception"])])) : $data.converted.length === 0 ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", _hoisted_20, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_howto_container)])) : ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
    key: 3
  }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_21, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: "col box circle hover active pointer margin-1",
    onClick: _cache[7] || (_cache[7] = (...args) => $options.downloadZip && $options.downloadZip(...args))
  }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['far', 'file-archive']
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('download-zip')), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: "col box circle hover active pointer margin-1",
    onClick: _cache[8] || (_cache[8] = (...args) => $options.resetConverted && $options.resetConverted(...args))
  }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: "eraser"
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('reset')), 1)]), $data.flags.convert ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(_component_LoadingPart, {
    key: 0
  })) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", _hoisted_22, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($data.converted, (img, index) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(_component_image_container, {
      class: "margin-tb-1",
      key: img.image.filename,
      org: img.org,
      converted: img.image,
      onClose: $event => $options.deleteConverted(index),
      onPreview: $event => $options.setPreviewConverted(index)
    }, null, 8, ["org", "converted", "onClose", "onPreview"]);
  }), 128))])], 64))]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_language_container, {
    onLang: $options.setLang
  }, null, 8, ["onLang"]), (0,runtime_core_esm_bundler/* createVNode */.bF)(_component_color_container, {
    onColor: $options.setColor
  }, null, 8, ["onColor"]), $options.isWeb() ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(_component_link_container, {
    key: 2,
    class: "margin-tb-4"
  })) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), $options.isElectron() && !$options.isUnite() && $data.flags.showVersionContainer ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(_component_version_container, {
    key: 3,
    class: "margin-tb-4",
    onClose: _cache[9] || (_cache[9] = $event => $data.flags.showVersionContainer = false),
    checkUpdate: $data.flags.checkUpdate,
    isLatest: $options.isLatest(),
    latestVersion: $data.latestVersion
  }, null, 8, ["checkUpdate", "isLatest", "latestVersion"])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]), $options.isWeb() ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("footer", _hoisted_23, " (C) " + (0,shared_esm_bundler/* toDisplayString */.v_)($options.year()) + " ののの茶屋. ", 1)) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true), (0,runtime_core_esm_bundler/* createVNode */.bF)(runtime_dom_esm_bundler/* Transition */.eB, {
    name: "fade"
  }, {
    default: (0,runtime_core_esm_bundler/* withCtx */.k6)(() => [$data.flags.showPreviewConverted ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createBlock */.Wv)(_component_preview_container, {
      key: 0,
      image: $data.previewConverted,
      onClose: _cache[10] || (_cache[10] = $event => $data.flags.showPreviewConverted = false)
    }, null, 8, ["image"])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true)]),
    _: 1
  })])]);
}
;// CONCATENATED MODULE: ./src/App.vue?vue&type=template&id=75d5146f

// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.push.js
var es_array_push = __webpack_require__(8743);
// EXTERNAL MODULE: ./node_modules/file-saver/dist/FileSaver.min.js
var FileSaver_min = __webpack_require__(4213);
var FileSaver_min_default = /*#__PURE__*/__webpack_require__.n(FileSaver_min);
;// CONCATENATED MODULE: ./src/lib/FileUtil.js


/**
 * ファイルを表示できる形式にするやつ
 * @param {Blob|MediaSource} blob
 * @returns {string}
 */
const toShowable = blob => {
  return window.URL.createObjectURL(blob);
};

/**
 * validator for image file
 * @param {unknown} val
 * @return {string}
 */
const isImageFile = val => {
  if (typeof val !== 'object' || Array.isArray(val) || toString.call(val) !== '[object File]') {
    return 'error-invalid-file';
  }
  if (!val.type.match(/^image\/(png|jpeg|gif)/)) {
    return 'error-invalid-image-type';
  }
  return '';
};

/**
 * validator for blob url
 * @param {string} url
 * @return {Promise<string>}
 */
const existsUrlFile = async url => {
  try {
    await fetch(url);
    return '';
  } catch (e) {
    return 'error-invalid-url';
  }
};

/**
 * FileをImageDataに変換するやつ
 * @param {string} url
 * @param {number} width
 * @param {number} height
 * @param {number} scale (0-1)
 * @returns {Promise<ImageData>}
 */
const fileToImageData = async (url, width, height, scale = 1) => {
  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const scaledWidth = parseInt(img.naturalWidth * scale);
      const scaledHeight = parseInt(img.naturalHeight * scale);
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, scaledWidth, scaledHeight);
      resolve(ctx.getImageData(0, 0, scaledWidth, scaledHeight));
    };
    img.onerror = err => {
      reject(err);
    };
  });
};

/**
 * ImageDataをBase64に変換するやつ
 * @param {ImageData} imageData
 * @returns {string}
 */
const imageDataToBase64 = imageData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
};

/**
 * ImageDataをリサイズするやつ
 * @param {ImageData} imageData
 * @param {number} width
 * @param {number} height
 * @param {boolean} imageSmoothingEnabled
 * @returns {Promise<ImageData>}
 */
const resizeImageData = async (imageData, width, height, imageSmoothingEnabled = true) => {
  const resizeWidth = width >> 0;
  const resizeHeight = height >> 0;
  const ibm = await window.createImageBitmap(imageData, 0, 0, imageData.width, imageData.height);
  const canvas = document.createElement('canvas');
  canvas.width = resizeWidth;
  canvas.height = resizeHeight;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = imageSmoothingEnabled;
  ctx.scale(resizeWidth / imageData.width, resizeHeight / imageData.height);
  ctx.drawImage(ibm, 0, 0);
  return ctx.getImageData(0, 0, resizeWidth, resizeHeight);
};

/**
 * Fileから縦横のサイズを返すやつ
 * @param {string} url
 * @returns {Promise<{width: number, height: number}>}
 */
const getFileSize = async url => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const size = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
      resolve(size);
    };
    img.onerror = err => {
      reject(err);
    };
    img.src = url;
  });
};

/**
 * ダウンロードするやつ
 * @param {string|Blob} file
 * @param {string} name
 * @returns {void}
 */
const download = (file, name) => {
  FileSaver_min_default().saveAs(file, name);
};

/**
 * transfer item を handle に変換するやつ
 * @param {DataTransferItem} item
 * @return {EntryFileHandle|FileSystemFileHandle|null}
 */
const transferItemToHandle = async item => {
  // Using FileEntry if available
  if ('webkitGetAsEntry' in item) return new EntryFileHandle(await item.webkitGetAsEntry());
  // Fallback to File System Access API
  if ('getAsFileSystemHandle' in item) return await item.getAsFileSystemHandle();
  return null;
};

/**
 * FileHandle wrapper for regular files
 * @implements {FileSystemFileHandle}
 */
class NativeFileHandle {
  /**
   * @param {Blob} file
   */
  constructor(file) {
    this._file = file;
  }
  async getFile() {
    return this._file;
  }
}

/**
 * FileHandle wrapper for FileSystemFileEntry
 * @implements {FileSystemFileHandle}
 */
class EntryFileHandle {
  /**
   * @param {FileSystemFileEntry} entry
   */
  constructor(entry) {
    this._entry = entry;
  }
  async getFile() {
    return new Promise((resolve, reject) => {
      this._entry.file(file => {
        resolve(file);
      }, e => {
        reject(e);
      });
    });
  }
}
// EXTERNAL MODULE: ./node_modules/nonono-validator/Validator.js
var Validator = __webpack_require__(2451);
;// CONCATENATED MODULE: ./src/lib/System.js
const packageJson = __webpack_require__(8330);


/**
 * バージョン取得
 * @returns {string}
 */
const version = () => {
  return packageJson.version;
};

/**
 * 言語設定の取得
 * @returns {string}
 */
const language = () => {
  return window.navigator.languages && window.navigator.languages[0] || window.navigator.language || window.navigator.userLanguage || window.navigator.browserLanguage;
};

/**
 * ウェブかどうか
 * @returns {boolean}
 */
const isWeb = () => {
  return !Validator/* default */.A.hasKeyInObject(({"NODE_ENV":"production","VUE_APP_GTAG":"G-1KZRGEYWQ7","VUE_APP_IS_UNITE":"0","VUE_APP_NODE_MODULES_PATH":"false","BASE_URL":""}), 'IS_ELECTRON') || ({"NODE_ENV":"production","VUE_APP_GTAG":"G-1KZRGEYWQ7","VUE_APP_IS_UNITE":"0","VUE_APP_NODE_MODULES_PATH":"false","BASE_URL":""}).IS_ELECTRON === '0';
};

/**
 * electronかどうか
 * @returns {boolean}
 */
const isElectron = () => {
  return !isWeb();
};

/**
 * UNITE向けかどうか
 * @returns {boolean}
 */
const isUnite = () => {
  return Validator/* default */.A.hasKeyInObject(({"NODE_ENV":"production","VUE_APP_GTAG":"G-1KZRGEYWQ7","VUE_APP_IS_UNITE":"0","VUE_APP_NODE_MODULES_PATH":"false","BASE_URL":""}), 'VUE_APP_IS_UNITE') && "0" !== '0';
};
;// CONCATENATED MODULE: ./src/lib/Ogp.js


/**
 * OGP向けタグを設定する
 * @param {string} property
 * @param {string} content
 * @returns {void}
 */
const setOgpValue = (property, content) => {
  if (isElectron) return;
  const meta = document.querySelector(`meta[property='${property}']`);
  meta ? changeOgpValue(meta, content) : createOgpValue(property, content);
};

/**
 * OGP向けタグを配列から設定していく
 * @param {{property: string, content: string}[]} values
 * @returns {void}
 */
const setOgpValuesByArray = values => {
  for (const {
    property,
    content
  } of values) {
    setOgpValue(property, content);
  }
};

/**
 * OGP向けタグの値を変更する
 * @param {Element} elm
 * @param {string} content
 * @returns {void}
 */
const changeOgpValue = (elm, content) => {
  elm.setAttribute('content', content);
};

/**
 * OGP向けタグを生成して追加する
 * @param {string} property
 * @param {string} content
 */
const createOgpValue = (property, content) => {
  const metaTag = document.createElement('meta');
  metaTag.setAttribute('property', property);
  metaTag.setAttribute('content', content);
};
// EXTERNAL MODULE: ./node_modules/jszip/dist/jszip.min.js
var jszip_min = __webpack_require__(1710);
var jszip_min_default = /*#__PURE__*/__webpack_require__.n(jszip_min);
;// CONCATENATED MODULE: ./src/lib/Archive.js


/**
 * 画像たちをzipにするやつ
 * @param {{base64: string, filename: string}[]} imgs
 * @returns {Promise<Blob|any>}
 */
const scaledImagesToZip = async imgs => {
  const zip = new (jszip_min_default())();
  for (const img of imgs) {
    zip.file(img.filename, img.base64.split(',')[1], {
      base64: true
    });
  }
  return new Promise((resolve, reject) => {
    zip.generateAsync({
      type: 'blob'
    }).then(content => {
      resolve(content);
    }).catch(err => {
      reject(err);
    });
  });
};
;// CONCATENATED MODULE: ./src/infrastructure/GitHub.js
/**
 * GitHubからタグ情報を得る
 * @returns {Promise<{name: string, zipball_url: string, tarball_url: string}[]>}
 */
const fetchTags = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/irokaru/pixel-scaler/tags');
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return [];
  }
};
;// CONCATENATED MODULE: ./src/lib/Version.js



/**
 * 最新版かどうかを返す。最新版だったら空文字が、そうでなければその最新版の番号が出る
 * @returns {Promise<string>}
 */
const checkVersion = async () => {
  const vers = await getVersions();
  if (vers.length === 0) return '';
  return compare(version(), vers[0]) ? vers[0] : '';
};

/**
 * バージョンをとってくる
 * @returns {Promise<string[]>}
 */
const getVersions = async () => {
  return (await fetchTags()).map(item => item?.name).filter(item => item);
};

/**
 * 現在バージョンが最新だったらtrueが返る
 * @param {string} now
 * @param {string} current
 * @returns {boolean}
 */
const compare = (now, current) => {
  return parge(now) < parge(current);
};

/**
 * バージョン番号を数字にして返す
 * @param {string} verStr
 * @returns {number}
 */
const parge = verStr => {
  return Number(verStr.split('.').map(num => num.padStart(3, '0')).join(''));
};
;// CONCATENATED MODULE: ./src/settings/color/red.json
var red_namespaceObject = /*#__PURE__*/JSON.parse('{"font":"#332d2d","background":"#ffe0e0","edgeBright":"rgba(255, 255, 255, 0.75)","edgeShadow":"rgba(192, 167, 167, 0.75)","scrollbarBackground":"#fff","scrollbarShadow":"#777","scrollbarThumb":"#ff7f7f"}');
;// CONCATENATED MODULE: ./src/settings/color/red_dark.json
var red_dark_namespaceObject = /*#__PURE__*/JSON.parse('{"font":"#ffdfdf","background":"#150808","edgeBright":"rgba(70, 40, 40, 0.75)","edgeShadow":"rgba(0, 0, 0, 0.75)","scrollbarBackground":"#fff","scrollbarShadow":"#777","scrollbarThumb":"#7c1c1c"}');
;// CONCATENATED MODULE: ./src/settings/color/blue.json
var blue_namespaceObject = /*#__PURE__*/JSON.parse('{"font":"#2d2d33","background":"#e0e0ff","edgeBright":"rgba(255, 255, 255, 0.75)","edgeShadow":"rgba(167, 167, 192, 0.75)","scrollbarBackground":"#fff","scrollbarShadow":"#777","scrollbarThumb":"#7f7fff"}');
;// CONCATENATED MODULE: ./src/settings/color/blue_dark.json
var blue_dark_namespaceObject = /*#__PURE__*/JSON.parse('{"font":"#dfdfff","background":"#080815","edgeBright":"rgba(40, 40, 70, 0.75)","edgeShadow":"rgba(0, 0, 0, 0.75)","scrollbarBackground":"#fff","scrollbarShadow":"#777","scrollbarThumb":"#1c1c7c"}');
;// CONCATENATED MODULE: ./src/settings/color/green.json
var green_namespaceObject = /*#__PURE__*/JSON.parse('{"font":"#2d332d","background":"#cfe8cf","edgeBright":"rgba(255, 255, 255, 0.75)","edgeShadow":"rgba(167, 192, 167, 0.75)","scrollbarBackground":"#fff","scrollbarShadow":"#777","scrollbarThumb":"#55ad55"}');
;// CONCATENATED MODULE: ./src/settings/color/green_dark.json
var green_dark_namespaceObject = /*#__PURE__*/JSON.parse('{"font":"#dfffdf","background":"#081508","edgeBright":"rgba(40, 70, 40, 0.75)","edgeShadow":"rgba(0, 0, 0, 0.75)","scrollbarBackground":"#fff","scrollbarShadow":"#777","scrollbarThumb":"#1c7c1c"}');
;// CONCATENATED MODULE: ./src/settings/color/gray.json
var gray_namespaceObject = /*#__PURE__*/JSON.parse('{"font":"#333333","background":"#e0e0e0","edgeBright":"rgba(255, 255, 255, 0.75)","edgeShadow":"rgba(192, 192, 192, 0.75)","scrollbarBackground":"#fff","scrollbarShadow":"#777","scrollbarThumb":"#7f7f7f"}');
;// CONCATENATED MODULE: ./src/settings/color/dark.json
var dark_namespaceObject = /*#__PURE__*/JSON.parse('{"font":"#ccc","background":"#333","edgeBright":"rgba(70, 70, 70, 0.75)","edgeShadow":"rgba(0, 0, 0, 0.75)","scrollbarBackground":"#fff","scrollbarShadow":"#777","scrollbarThumb":"#1c1c1c"}');
;// CONCATENATED MODULE: ./src/lib/LocalStorage.js
/**
 * 保存する
 * @param {string} key
 * @param {string} value
 */
const setItem = (key, value) => {
  if (value) {
    localStorage.setItem(key, value);
    return;
  }
  localStorage.removeItem(key);
};

/**
 * 取得する
 * @param {string} key
 * @returns {string|null}
 */
const getItem = key => {
  return localStorage.getItem(key);
};

/**
 * 存在するか
 * @param {string} key
 * @returns {boolean}
 */
const existsItem = key => {
  return localStorage.getItem(key) !== null;
};
;// CONCATENATED MODULE: ./src/settings/color.js










// --------------------------------------------------------------------

const DEFAULT_COLOR_KEY = 'red';
const STORAGE_KEY = 'color';
const colors = {
  red: red_namespaceObject,
  blue: blue_namespaceObject,
  green: green_namespaceObject,
  gray: gray_namespaceObject,
  red_dark: red_dark_namespaceObject,
  blue_dark: blue_dark_namespaceObject,
  green_dark: green_dark_namespaceObject,
  dark: dark_namespaceObject
};

// --------------------------------------------------------------------

/**
 * デフォルトの色の名前を返す
 * @returns {string}
 */
const getDefaultColorKey = () => {
  if (!existsItem(STORAGE_KEY)) return DEFAULT_COLOR_KEY;
  const key = getItem(STORAGE_KEY);
  if (!existsColorKey(key)) return DEFAULT_COLOR_KEY;
  return key;
};

/**
 * デフォルトの色の値を返す
 * @returns {string}
 */
const getDefaultColorValues = () => {
  const key = getDefaultColorKey();
  return colors[key];
};

/**
 * デフォルトの色の名前を保存する
 * @returns {boolean}
 */
const setDefaultColorKey = key => {
  if (!existsColorKey(key)) return false;
  setItem(STORAGE_KEY, key);
  return true;
};

/**
 * 色が存在するか
 * @param {string} key
 * @returns {boolean}
 */
const existsColorKey = key => {
  return Object.keys(colors).includes(key);
};
// EXTERNAL MODULE: ./node_modules/vue-i18n/dist/vue-i18n.esm-bundler.js + 4 modules
var vue_i18n_esm_bundler = __webpack_require__(7861);
;// CONCATENATED MODULE: ./src/settings/i18n/ja.json
var ja_namespaceObject = /*#__PURE__*/JSON.parse('{"title":"ぴくせる すけゐらぁ","original-pixel-size":"オリジナルの倍率","scale-mode":"拡大モード","scale":"拡大率","select":"{count}件のファイルを選択中","no-select":"ピクチャを選択(gif/jpeg/png)","download-zip":"ZIPダウンロード","convert":"変換","reset":"リセット","scale-mode-xbr":"なめらか","scale-mode-nn":"たんじゅん","ogp-description":"ドット絵をイラスト調にリサイズできるやつです","exception":"エラーが発生しました。作った人に下記のテキストを送りつけてください。","error-invalid-file":"ファイルを選択してください ({filename})","error-invalid-image-type":"pngかjpegかgifを選択してください ({filename})","error-invalid-image-size":"ピクセルのサイズとピクチャのサイズが一致しません ({filename})","error-invalid-url":"ファイルを読み込むことができません ({filename})。ファイルを変更した場合は、再度ファイルを選択してください。","attention":"注意","attention-01":"iPhoneのsafari14では変換ができない不具合が発生しています。ご利用の方はPC等でお試しください。","whatis":"なにこれ","whatis-detail":"<a href=\\"{xbrjs}\\" target=\\"_blank\\">xBRjs</a>を用いたスケーリングアプリです。比較的お手軽にピクセルアートをイラスト調に変換することができます。変換されたピクセルアートは良心の範囲内で個人商業問わず自由に使用することができます。","usage":"つかいかた","usage-step-01":"原寸大のピクセルアートを拡大する場合は「オリジナルの倍率」をx1に、拡大したピクセルアートを拡大する場合は元々のサイズから拡大した倍率に合わせてx2～x4を選択。","usage-step-02":"拡大率(%)入力欄から拡大率(100%～800%)を設定する","usage-step-03":"ピクチャを選択ボタンをクリックしてピクチャを選ぶ","usage-step-04":"変換ボタンをクリックする","usage-step-05":"イラスト調で拡大されたピクチャが出てくる","usage-step-06":"出てきたピクチャ下部の「ダウンロードボタン」か「ZIPダウンロードボタン」をクリックしてピクチャを保存","usage-step-07":"幸せ！","tips":"Tips","tips-01":"原寸のドット絵で変換するとキレイな仕上がりになります","tips-02":"解像度の低いイラスト(ドット絵ではない)はキレイに拡大されません","tips-03":"拡大率を100%に指定することでドット絵にアンチエイリアスをかけることができます","tips-04":"ピクセルの大きさの指定値とピクセルアートのピクセルの大きさが異なる場合は変換に失敗する場合があります","link-share-on-twitter":"共有(twitter)","link-developer":"作った人","link-repository":"リポジトリ","link-booth":"Booth","link-license":"ライセンス","version-check":"アップデート確認中…","version-new-notice":"最新バージョン v.{version} がリリースされています","version-new-download":"ダウンロードは<a href=\\"{booth}\\" target=\\"_blank\\">booth</a>か<a href=\\"{github}\\" target=\\"_blank\\">github</a>から！","version-latest-now":"お使いのバージョンは最新版です"}');
;// CONCATENATED MODULE: ./src/settings/i18n/en.json
var en_namespaceObject = /*#__PURE__*/JSON.parse('{"title":"PiXel ScaLer","original-pixel-size":"Original magnification","scale-mode":"scale mode","scale":"scale","select":"{count} files selected","no-select":"select image(gif/jpeg/png)","download-zip":"download ZIP","convert":"convert","reset":"reset","scale-mode-xbr":"smooth","scale-mode-nn":"simple","ogp-description":"This is a web application that can resize pixel arts to illustration style.","exception":"An error has occurred. Please contact the developer.","error-invalid-file":"Please select a file. ({filename})","error-invalid-image-type":"Please select a png, jpeg or gif. ({filename})","error-invalid-image-size":"The pixel size does not match the image size. ({filename})","error-invalid-url":"Unable to load file ({filename}). If you have changed the file, please select the file again.","attention":"Attention","attention-01":"There is a bug where conversion doesn\'t work with Safari 14 on iPhone. Please try using a PC.","whatis":"What is this","whatis-detail":"PiXel ScaLer is a scaling application that provides a relatively easy way to convert pixel art to illustration style art using <a href=\\"{xbrjs}\\" target=\\"_blank\\">xBRjs</a>. You may use the converted pixel art for personal or commercial use within the limits of your conscience.","usage":"Usage","usage-step-01":"To enlarge full-size pixel art, select x1 for \\"Original Magnification\\", to enlarge an enlarged pixel art, select from x2 to x4, depending on the magnification from the original size.","usage-step-02":"Set the scale factor (100% to 800%) from the scale (%) input field.","usage-step-03":"Click the \\"select image\\" button to select an image","usage-step-04":"Click convert.","usage-step-05":"An enlarged illustration style image will be displayed.","usage-step-06":"Click the \\"download ZIP\\" button or the download icon under the image to save it.","usage-step-07":"ENJOY!","tips":"Tips","tips-01":"Converting pixel art of the original size will yield the best results.","tips-02":"Images that are not pixel art will not be enlarged nicely.","tips-03":"You can anti-alias the pixel art by setting the scale factor to 100%.","tips-04":"The Conversion may fail if the specified pixel size is different from the pixel size of the pixel art.","link-share-on-twitter":"share (twitter)","link-developer":"developer","link-repository":"repository","link-booth":"booth","link-license":"license","version-check":"checking for updates...","version-new-notice":"The latest version v.{version} has been released","version-new-download":"Download it from <a href=\\"{booth}\\" target=\\"_blank\\">booth</a> or <a href=\\"{github}\\" target=\\"_blank\\">github</a>!","version-latest-now":"Your version is the latest."}');
;// CONCATENATED MODULE: ./src/settings/i18n/cn.json
var cn_namespaceObject = /*#__PURE__*/JSON.parse('{"title":"PiXel ScaLer","original-pixel-size":"像素大小","scale-mode":"放大方式","scale":"原放大率","select":"已选择{count}个文件","no-select":"选择图片（gif/jpeg/png）","download-zip":"ZIP下载","convert":"转换","reset":"重置","scale-mode-xbr":"平滑","scale-mode-nn":"单纯","ogp-description":"这是一个可以将像素艺术调整为插图风格的网络应用","exception":"发生错误。请将以下文本发送给开发者。","error-invalid-file":"请选择文件 （{filename}）","error-invalid-image-type":"请选择png或jpeg或gif（{filename}）","error-invalid-image-size":"像素大小与图片大小不一致 （{filename}）","error-invalid-url":"无法加载文件({filename})。如果你改变了文件，请重新选择该文件。","attention":"注意","attention-01":"iPhone的safari14无法进行无法转换。请使用PC等其他设备重试。","whatis":"这是什么","whatis-detail":"这是采用了<a href= \\"{xbrjs}\\" target=\\"_blank\\">xBRjs</a >的扩展应用。可以较轻松地将像素图转换成插图风格。你可以在你的良知范围内将转换后的像素艺术用于个人或商业用途。","usage":"使用方法","usage-step-01":"要放大全尺寸的像素图画，在 \\"原始放大率 \\"中选择x1，要放大已放大的像素图画，选择x2到x4，取决于从原始尺寸的放大率。","usage-step-02":"在放大率（%）输入栏设置放大率（100%～800%）","usage-step-03":"点击选择图片按钮选择图片","usage-step-04":"点击转换按钮","usage-step-05":"弹出以插画风格放大的图片","usage-step-06":"点击弹出图片底部的“下载按钮”或“ZIP下载按钮”保存图片","usage-step-07":"完成！","tips":"小锦囊","tips-01":"用原尺寸的像素图来转换的话能得到美丽的插图","tips-02":"分辨率低的插图（非像素图）的放大效果较差","tips-03":"你可以通过将放大率指定为100%来对像素图进行抗锯齿处理","tips-04":"如果像素大小的指定值与像素图的像素大小不同，转换可能会失败","link-share-on-twitter":"分享（twitter）","link-developer":"开发者","link-repository":"代码仓","link-booth":"Booth","link-license":"证书","version-check":"正在确认更新……","version-new-notice":"最新版本 v.{version} 已发布","version-new-download":"在此下载：<a href=\\"{booth}\\" target=\\"_blank\\">Booth</a >或者<a href=\\"{github}\\" target=\\"_blank\\">github</a >！","version-latest-now":"当前版本已是最新版"}');
;// CONCATENATED MODULE: ./src/settings/i18n/es.json
var es_namespaceObject = /*#__PURE__*/JSON.parse('{"title":"PiXel ScaLer","original-pixel-size":"Aumento original","scale-mode":"modo de escala","scale":"escala","select":"Seleccionado {count} archivo/s","no-select":"Seleccionar imagen(gif/jpeg/png)","download-zip":"descargar ZIP","convert":"convertir","reset":"resetear","scale-mode-xbr":"liso","scale-mode-nn":"simple","ogp-description":"Esta es una aplicación web que puede redimensionar artes de píxeles al estilo de una ilustración.","exception":"Se ha producido un error. Póngase en contacto con el desarrollador.","error-invalid-file":"Por favor, seleccione un archivo. ({filename})","error-invalid-image-type":"Elija png, jpeg o gif. ({filename})","error-invalid-image-size":"El tamaño de los píxeles no coincide con el tamaño de la imagen. ({filename})","error-invalid-url":"No se ha podido cargar el archivo ({filename}). Si el archivo ha sido editado, por favor, vuelva a cargarlo.","attention":"Atención","attention-01":"Hay un error que hace que la conversión no funcione con Safari 14 en el iPhone. Por favor, intente utilizar un PC.","whatis":"¿Qué es esto?","whatis-detail":"Esta es una aplicación de escalado que utiliza <a href=\\"{xbrjs}\\" target=\\"_blank\\">xBRjs</a>. Es una forma relativamente fácil de convertir el arte de píxeles en estilo de ilustración. Puedes utilizar el pixel art convertido para uso personal o comercial dentro de los límites de tu conciencia.","usage":"Uso","usage-step-01":"Para ampliar el pixel art a tamaño completo, seleccione x1 para la \\"Ampliación original\\", para ampliar un pixel art ampliado, seleccione de x2 a x4, dependiendo de la ampliación del tamaño original.","usage-step-02":"Establezca el factor de escala (100%-800%) desde el campo de entrada de escala (%).","usage-step-03":"Haz clic en el botón \\"Seleccionar imagen\\" para elegir una imagen.","usage-step-04":"Haz clic en convertir.","usage-step-05":"Se mostrara una imagen ampliada de referencia.","usage-step-06":"Haga clic en el botón \\"Descargar\\" o en el botón \\"Descargar ZIP\\" en la parte inferior de la imagen para guardarla.","usage-step-07":"¡FELIZ!","tips":"Consejos","tips-01":"La conversión con pixel art del tamaño real le dará un resultado hermoso.","tips-02":"Las ilustraciones que no son pixel art no se ampliarán bien.","tips-03":"Puede suavizar el pixel art configurando el factor de escala al 100%.","tips-04":"La conversión puede fallar si el tamaño de píxel especificado es diferente del tamaño de píxel del pixel art.","link-share-on-twitter":"compartir(twitter)","link-developer":"desarrollador","link-repository":"repositorio","link-booth":"Booth","link-license":"LICENCIA","version-check":"comprobando actualizaciones...","version-new-notice":"Se ha lanzado la última versión v.{version}","version-new-download":"¡Descárgalo desde <a href=\\"{booth}\\" target=\\"_blank\\">booth</a> o <a href=\\"{github}\\" target=\\"_blank\\">github</a>!","version-latest-now":"Su versión es la última."}');
;// CONCATENATED MODULE: ./src/settings/i18n/tr.json
var tr_namespaceObject = /*#__PURE__*/JSON.parse('{"title":"PiXel BoyUtlaNdırIcı","original-pixel-size":"Orjinal piksel boyutu","scale":"boyut","select":"{count} dosya seçildi","no-select":"dosya seç(gif/jpeg/png)","download-zip":"ZIP olarak indir","convert":"dönüştür","reset":"sıfırla","ogp-description":"Bu piksel çizimleri büyütebilen bir web sitesidir.","exception":"Bir hata meydana geldi. Lütfen geliştirici ile iletişime geçin.","error-invalid-file":"Lütfen dosya seçin. ({filename})","error-invalid-image-type":"Lütfen .png, .jpeg veya .gif seçin. ({filename})","error-invalid-image-size":"Seçtiğiniz orjinal piksel boyutu şu dosya ile uyuşmuyor: ({filename})","error-invalid-url":"Dosya yüklenemiyor ({filename}). Dosyayı değiştirdiyseniz, lütfen dosyayı tekrar seçin.","attention":"Dikkat","attention-01":"iPhone\'da Safari 14 ile ilgili bir bug bulunmakta... Lütfen bilgisayar kullanmayı deneyin.","whatis":"Bu nedir?","whatis-detail":"PiXel BoyUtlaNdırIcı <a href=\\"{xbrjs}\\" target=\\"_blank\\">xBRjs</a> kullanarak piksel çizimleri, sanat tarzını bozmadan büyütebilen bir web sitesidir. Dönüştürülmüş piksel sanatını vicdanınızın sınırları dahilinde kişisel veya ticari kullanım için kullanabilirsiniz. Dönüştürülmüş piksel sanatını vicdanınızın sınırları dahilinde kişisel veya ticari kullanım için kullanabilirsiniz.","usage":"Usage","usage-step-01":"Orjinal boyuta sahip olan bir piksel çizim yüklediyseniz, \\"Original Magnification\\" için x1\'i seçin. Halihazırda boyutu büyütülmüş bir çizimi tekrardan büyütmek istiyorsanız, büyütme oranına bağlı olarak 2x, 3x veya 4x\'i seçin.","usage-step-02":"Boyutlandırma faktörünü (100% - 400%) belirlemek için, boyut (%) yazı alanını kullanın.","usage-step-03":"\\"dosya seç\\" düğmesine basarak dosya seçin.","usage-step-04":"Dönüştürmek için tıklayın.","usage-step-05":"Büyütülmüş bir çizim gösterilecek.","usage-step-06":"\\"ZIP olara indir\\" düğmesine yada resmin altındaki indirme düğmesine basarak kaydedin.","usage-step-07":"Keyfini çıkarın!","tips":"İp uçları","tips-01":"Piksel çizimi orjianl boyutundan büyütmek daha iyi sonuçlar verir.","tips-02":"Piksel çizim olmayan resimler genellikle iyi sonuçlar vermez.","tips-03":"Sadece AA efekti uygulamak isterseniz; boyut (%) değerini \\"100%\\" yapabilirsiniz.","tips-04":"Eğer girdiğiiz \\"Orjinal Piksel Boyutu\\" resim ile eşleşmiyorsa dönüştürme eylemi hata verebilir.","link-share-on-twitter":"paylaş (twitter)","link-developer":"geliştirici","link-repository":"kaynak kodu","link-booth":"booth","link-license":"lisans","version-check":"güncellemeler denetleniyor...","version-new-notice":"En son sürüm v.{version} yayınlandı","version-new-download":"<a href=\\"{booth}\\" target=\\"_blank\\">booth</a> veya <a href=\\"{github}\\" target=\\"_blank\\">github</a> kullanarak indirebilirsiniz!!","version-latest-now":"Kullandığınız sürüm son sürüm."}');
;// CONCATENATED MODULE: ./src/settings/lang.js









// --------------------------------------------------------------------

const lang_STORAGE_KEY = 'language';
const langs = {
  ja: ja_namespaceObject,
  en: en_namespaceObject,
  cn: cn_namespaceObject,
  es: es_namespaceObject,
  tr: tr_namespaceObject
};
const langsForUnite = {
  ja: ja_namespaceObject,
  en: en_namespaceObject,
  cn: cn_namespaceObject
};

// --------------------------------------------------------------------

/**
 * デフォルトの言語名を返す
 * @returns {string}
 */
const getDefaultLanguage = () => {
  if (!existsItem(lang_STORAGE_KEY)) return language();
  const lang = getItem(lang_STORAGE_KEY);
  if (!existsLanguage(lang)) language();
  return lang;
};

/**
 * デフォルトの言語名を保存する
 * @param {string} lang
 * @returns {boolean}
 */
const setDefaultLanguage = lang => {
  if (!existsLanguage(lang)) return false;
  setItem(lang_STORAGE_KEY, lang);
  return true;
};

/**
 * 言語名を返す
 * @returns {string[]}
 */
const getLanguageNames = () => {
  return Object.keys(getAllLanguages());
};

/**
 * 言語が存在するか
 * @param {string} lang
 * @returns {boolean}
 */
const existsLanguage = lang => {
  return getLanguageNames().includes(lang);
};

/**
 * 全言語オブジェクトを返す
 * @returns {{[key: string]: {[key: string]: string}}}
 */
const getAllLanguages = () => {
  return isUnite() ? langsForUnite : langs;
};

// --------------------------------------------------------------------

const i18n = (0,vue_i18n_esm_bundler/* createI18n */.hU)({
  locale: getDefaultLanguage(),
  fallbackLocale: 'en',
  messages: getAllLanguages()
});
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.to-reversed.js
var esnext_typed_array_to_reversed = __webpack_require__(4517);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.to-sorted.js
var esnext_typed_array_to_sorted = __webpack_require__(1794);
// EXTERNAL MODULE: ./node_modules/core-js/modules/esnext.typed-array.with.js
var esnext_typed_array_with = __webpack_require__(1319);
// EXTERNAL MODULE: ./node_modules/xbr-js/src/index.js
var src = __webpack_require__(4772);
;// CONCATENATED MODULE: ./src/lib/scaler/xbr.js







/**
 * execute xbr scaling
 * @param {string} url url of file
 * @param {number} scalePer 100-
 * @param {number} pixelSize
 * @return {Promise<{message: 'success'|string, image?: ImageData}>}
 */
const execute = async (url, scalePer, pixelSize) => {
  const orgSize = await getFileSize(url);
  const sizeError = validateImageSize(orgSize, pixelSize);
  if (sizeError !== '') return {
    message: sizeError
  };
  const orgImageData = await fileToImageData(url, orgSize.width, orgSize.height, 1 / pixelSize);
  const scaled = await scale(orgImageData, orgSize, pixelSize * scalePer, pixelSize);
  return {
    message: 'success',
    image: scaled
  };
};

/**
 *
 * @param {ImageData} imageData
 * @param {{width: number, height: number}} orgSize
 * @param {number} scalePer 100-
 * @param {number} pixelSize 1-
 * @returns {Promise<ImageData>}
 */
const scale = async (imageData, orgSize, scalePer, pixelSize) => {
  let uarray = new Uint32Array(imageData.data.buffer);
  const size = {
    width: imageData.width,
    height: imageData.height
  };
  for (const per of calcScalePers(scalePer)) {
    const [xbr, retio] = getXbrFunctionByScalePercent(per);
    uarray = xbr(uarray, size.width, size.height);
    size.width = size.width * retio;
    size.height = size.height * retio;
  }
  const scaled = new ImageData(new Uint8ClampedArray(uarray.buffer), size.width, size.height);
  return resizeImageData(scaled, orgSize.width * scalePer * (1 / pixelSize) / 100, orgSize.height * scalePer * (1 / pixelSize) / 100);
};

/**
 * return number between 100% to 400% array by split scalePer
 * TODO: more simple logic
 * @param {number} scalePer (100-)
 * @param {number} max (101-)
 * @return {number[]} (100-max)[]
 */
const calcScalePers = (scalePer, max = 400) => {
  if (!Number.isInteger(scalePer) || scalePer <= 0) throw new Error('invalid scalePer value');
  if (!Number.isInteger(max) || max <= 100) throw new Error('invalid max value');
  if (scalePer <= max) return [scalePer];
  scalePer /= 100;
  max /= 100;
  const scalePers = [max];
  const div = scalePer / max;
  if (div <= max) scalePers.push(div);
  if (max < div) scalePers.push(...calcScalePers(div * 100 >> 0, max * 100).map(per => per /= 100));
  return scalePers.map(per => per * 100);
};

/**
 * return xbr scale function by scale percent
 * @param {number} scalePer (100-400)
 * @return {[(image: Uint32Array, sourceWidth: number, sourceHeight: number, options: any) => Uint32Array, number]}
 */
const getXbrFunctionByScalePercent = scalePer => {
  const methods = {
    2: src/* xbr2x */.tA,
    3: src/* xbr3x */.cZ,
    4: src/* xbr4x */.bK
  };
  if (scalePer < 200) return [methods[2], 2];
  const ceil = Math.ceil(scalePer / 100);
  return [methods[ceil], ceil];
};

/**
 * validator for image width and height
 * @param {{width: number, height: number}} size
 * @param {number} pixelSize
 * @returns {string}
 */
const validateImageSize = (size, pixelSize) => {
  const modWidth = size.width % pixelSize;
  const modHeight = size.height % pixelSize;
  if (0 < modWidth + modHeight) return 'error-invalid-image-size';
  return '';
};
;// CONCATENATED MODULE: ./src/lib/scaler/nearestneighbor.js


/**
 * execute nearestneighbor scaling
 * @param {string} url url of file
 * @param {number} scalePer 100-
 * @param {number} pixelSize
 * @return {Promise<{message: 'success'|string, image?: ImageData}>}
 */
const nearestneighbor_execute = async (url, scalePer, pixelSize) => {
  const orgSize = await getFileSize(url);
  const sizeError = nearestneighbor_validateImageSize(orgSize, pixelSize);
  if (sizeError !== '') return {
    message: sizeError
  };
  const orgImageData = await fileToImageData(url, orgSize.width, orgSize.height, 1 / pixelSize);
  const scaled = await nearestneighbor_scale(orgImageData, orgSize, pixelSize * scalePer, pixelSize);
  return {
    message: 'success',
    image: scaled
  };
};

/**
 * ジャギジャギに拡大縮小するやつ
 * @param {ImageData} imageData
 * @param {{width: number, height: number}} orgSize
 * @param {number} scalePer
 * @param {number} pixelSize
 * @returns {Promise<ImageData>}
 */
const nearestneighbor_scale = async (imageData, orgSize, scalePer, pixelSize) => {
  return await resizeImageData(imageData, orgSize.width * scalePer * (1 / pixelSize) / 100, orgSize.height * scalePer * (1 / pixelSize) / 100, false);
};

/**
 * validator for image width and height
 * @param {{width: number, height: number}} size
 * @param {number} pixelSize
 * @returns {string}
 */
const nearestneighbor_validateImageSize = (size, pixelSize) => {
  const modWidth = size.width % pixelSize;
  const modHeight = size.height % pixelSize;
  if (0 < modWidth + modHeight) return 'error-invalid-image-size';
  return '';
};
;// CONCATENATED MODULE: ./src/controllers/PictureScale.js




/**
 * きれいに拡大縮小するやつ
 * @param {File} file
 * @param {number} scalePer (100-800)
 * @param {number} pixelSize (1-4)
 * @param {string} algo
 * @return {Promise<{status: 'success', org: File, image: {base64: string, filename: string, scale: number, pixelSize: number}}|{status: 'failed', org: File, message: string}>}
 */
const PictureScale_scale = async (file, scalePer, pixelSize, algo) => {
  const fileUrl = toShowable(file);
  const fileError = isImageFile(file);
  if (fileError !== '') return error(message, file);
  const urlError = await existsUrlFile(fileUrl);
  if (urlError !== '') return error(message, file);
  const algoMethod = getScaleAlgorithm(algo);
  if (!algoMethod) throw new Error(`undefined algo: ${algo}`);
  const {
    message,
    image
  } = await algoMethod(fileUrl, scalePer, pixelSize);
  if (message !== 'success') return error(message, file);
  return {
    status: 'success',
    image: {
      base64: imageDataToBase64(image),
      filename: file.name,
      scale: scalePer,
      pixelSize: pixelSize
    },
    org: file,
    unload: () => URL.revokeObjectURL(fileUrl)
  };
};

/**
 * パラメータを範囲内に収めて返すやつ
 * @param {number} pixelSize
 * @param {number} scale
 * @returns {[number, number]}
 */
const adjustParams = (pixel, scale) => {
  pixel = pixel >> 0;
  scale = scale >> 0;
  if (pixel < 1) pixel = 1;
  if (4 < pixel) pixel = 4;
  if (scale < 100) scale = 100;
  if (800 < scale) scale = 800;
  return [pixel, scale];
};

/**
 * キーをもとにアルゴリズムを返す
 * @param {string} key
 * @returns {(url: string, scalePer: number, pixelSize: number) => Promise<{message: string, image: ImageData}>}
 */
const getScaleAlgorithm = key => {
  const algorithms = {
    xbr: execute,
    nn: nearestneighbor_execute
  };
  if (!Object.keys(algorithms).includes(key)) return null;
  return algorithms[key];
};

/**
 * create error status object
 * @param {string} message
 * @param {File} org
 * @returns {{status: string, message: string, org: File}}
 */
const error = (message, org) => {
  return {
    status: 'failed',
    message,
    org
  };
};
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/LoadingPart.vue?vue&type=template&id=6ce60b4b&scoped=true

const _withScopeId = n => (_pushScopeId("data-v-6ce60b4b"), n = n(), _popScopeId(), n);
const LoadingPartvue_type_template_id_6ce60b4b_scoped_true_hoisted_1 = {
  class: "loader"
};
function LoadingPartvue_type_template_id_6ce60b4b_scoped_true_render(_ctx, _cache) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", LoadingPartvue_type_template_id_6ce60b4b_scoped_true_hoisted_1, "Loading...");
}
;// CONCATENATED MODULE: ./src/components/LoadingPart.vue?vue&type=template&id=6ce60b4b&scoped=true

;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-12.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-12.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-12.use[2]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/LoadingPart.vue?vue&type=style&index=0&id=6ce60b4b&scoped=true&lang=css
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/LoadingPart.vue?vue&type=style&index=0&id=6ce60b4b&scoped=true&lang=css

// EXTERNAL MODULE: ./node_modules/vue-loader/dist/exportHelper.js
var exportHelper = __webpack_require__(6262);
;// CONCATENATED MODULE: ./src/components/LoadingPart.vue

const script = {}

;


const __exports__ = /*#__PURE__*/(0,exportHelper/* default */.A)(script, [['render',LoadingPartvue_type_template_id_6ce60b4b_scoped_true_render],['__scopeId',"data-v-6ce60b4b"]])

/* harmony default export */ var LoadingPart = (__exports__);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/AttentionContainer.vue?vue&type=template&id=1ccb9378

const AttentionContainervue_type_template_id_1ccb9378_hoisted_1 = {
  key: 0,
  class: "box block margin-tb-2"
};
function AttentionContainervue_type_template_id_1ccb9378_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_fa = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("v-fa");
  return $data.attentions.length ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", AttentionContainervue_type_template_id_1ccb9378_hoisted_1, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: "times-circle",
    class: "close-btn pointer",
    onClick: _cache[0] || (_cache[0] = $event => _ctx.$emit('close'))
  }), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h2", null, (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('attention')), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", null, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($data.attentions, attention => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", {
      key: attention
    }, (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t(attention)), 1);
  }), 128))])])) : (0,runtime_core_esm_bundler/* createCommentVNode */.Q3)("", true);
}
;// CONCATENATED MODULE: ./src/components/AttentionContainer.vue?vue&type=template&id=1ccb9378

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/AttentionContainer.vue?vue&type=script&lang=js
/* harmony default export */ var AttentionContainervue_type_script_lang_js = ({
  data() {
    return {
      attentions: []
    };
  },
  emits: ['close']
});
;// CONCATENATED MODULE: ./src/components/AttentionContainer.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/AttentionContainer.vue




;
const AttentionContainer_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(AttentionContainervue_type_script_lang_js, [['render',AttentionContainervue_type_template_id_1ccb9378_render]])

/* harmony default export */ var AttentionContainer = (AttentionContainer_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/HowtoContainer.vue?vue&type=template&id=8844f8f6

const HowtoContainervue_type_template_id_8844f8f6_hoisted_1 = ["innerHTML"];
const HowtoContainervue_type_template_id_8844f8f6_hoisted_2 = {
  class: "margin-t-2"
};
const HowtoContainervue_type_template_id_8844f8f6_hoisted_3 = ["innerHTML"];
const HowtoContainervue_type_template_id_8844f8f6_hoisted_4 = {
  class: "margin-t-2"
};
function HowtoContainervue_type_template_id_8844f8f6_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_fa = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("v-fa");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h2", null, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['fas', 'question-circle']
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('whatis')), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("p", {
    innerHTML: _ctx.$t('whatis-detail', {
      xbrjs: 'https://github.com/joseprio/xBRjs'
    })
  }, null, 8, HowtoContainervue_type_template_id_8844f8f6_hoisted_1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h2", HowtoContainervue_type_template_id_8844f8f6_hoisted_2, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['fas', 'pencil-alt']
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('usage')), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ol", null, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($data.usageNum, num => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", {
      key: num,
      innerHTML: _ctx.$t(`usage-step-${num}`)
    }, null, 8, HowtoContainervue_type_template_id_8844f8f6_hoisted_3);
  }), 128))]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("h2", HowtoContainervue_type_template_id_8844f8f6_hoisted_4, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['fas', 'bolt']
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('tips')), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("ul", null, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($data.tipsNum, num => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("li", {
      key: num
    }, (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t(`tips-${num}`)), 1);
  }), 128))])], 64);
}
;// CONCATENATED MODULE: ./src/components/HowtoContainer.vue?vue&type=template&id=8844f8f6

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/HowtoContainer.vue?vue&type=script&lang=js
/* harmony default export */ var HowtoContainervue_type_script_lang_js = ({
  data() {
    return {
      usageNum: ['01', '02', '03', '04', '05', '06', '07'],
      tipsNum: ['01', '02', '03', '04']
    };
  }
});
;// CONCATENATED MODULE: ./src/components/HowtoContainer.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/HowtoContainer.vue




;
const HowtoContainer_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(HowtoContainervue_type_script_lang_js, [['render',HowtoContainervue_type_template_id_8844f8f6_render]])

/* harmony default export */ var HowtoContainer = (HowtoContainer_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ImageContainer.vue?vue&type=template&id=c449eaf0&scoped=true

const ImageContainervue_type_template_id_c449eaf0_scoped_true_withScopeId = n => (_pushScopeId("data-v-c449eaf0"), n = n(), _popScopeId(), n);
const ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_1 = {
  class: "box image-box"
};
const ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_2 = {
  class: "image-name"
};
const ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_3 = ["src"];
const ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_4 = {
  class: "image-info"
};
const ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_5 = {
  class: "btn-list image-btns"
};
const ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_6 = ["href", "download"];
function ImageContainervue_type_template_id_c449eaf0_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_fa = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("v-fa");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_1, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: "times-circle",
    class: "close-btn pointer",
    onClick: _cache[0] || (_cache[0] = $event => _ctx.$emit('close'))
  }), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_2, (0,shared_esm_bundler/* toDisplayString */.v_)($props.converted.filename), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: "box-reverse block pointer image-wrapper",
    onClick: _cache[1] || (_cache[1] = $event => _ctx.$emit('preview'))
  }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
    class: "cover",
    src: $props.converted.base64
  }, null, 8, ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_3)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_4, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", null, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['fas', 'th']
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" x" + (0,shared_esm_bundler/* toDisplayString */.v_)($props.converted.pixelSize), 1)]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("span", null, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['fas', 'search-plus']
  }), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)($props.converted.scale) + "%", 1)])]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_5, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("div", {
    class: "box circle pointer margin-1 hover active",
    onClick: _cache[2] || (_cache[2] = $event => _ctx.$emit('preview'))
  }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['fas', 'search-plus']
  })]), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("a", {
    class: "box circle margin-1 hover active",
    href: $props.converted.base64,
    download: $props.converted.filename
  }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: ['fas', 'download']
  })], 8, ImageContainervue_type_template_id_c449eaf0_scoped_true_hoisted_6)])]);
}
;// CONCATENATED MODULE: ./src/components/ImageContainer.vue?vue&type=template&id=c449eaf0&scoped=true

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ImageContainer.vue?vue&type=script&lang=js

/* harmony default export */ var ImageContainervue_type_script_lang_js = ({
  props: {
    org: {
      type: Object,
      required: true
    },
    converted: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'preview'],
  methods: {
    /**
     * ファイルを表示できる形式にするやつ
     * @param {Blob} files
     * @returns {string}
     */
    toShowable(blob) {
      return toShowable(blob);
    }
  }
});
;// CONCATENATED MODULE: ./src/components/ImageContainer.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ImageContainer.vue?vue&type=style&index=0&id=c449eaf0&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/ImageContainer.vue?vue&type=style&index=0&id=c449eaf0&lang=scss&scoped=true

;// CONCATENATED MODULE: ./src/components/ImageContainer.vue




;


const ImageContainer_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(ImageContainervue_type_script_lang_js, [['render',ImageContainervue_type_template_id_c449eaf0_scoped_true_render],['__scopeId',"data-v-c449eaf0"]])

/* harmony default export */ var ImageContainer = (ImageContainer_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/LanguageContainer.vue?vue&type=template&id=0590a3a4

const LanguageContainervue_type_template_id_0590a3a4_hoisted_1 = {
  class: "languages margin-tb-2"
};
const LanguageContainervue_type_template_id_0590a3a4_hoisted_2 = ["onClick"];
function LanguageContainervue_type_template_id_0590a3a4_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", LanguageContainervue_type_template_id_0590a3a4_hoisted_1, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($data.langs, lang => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", {
      class: "box circle margin-1 pointer hover active",
      key: lang,
      onClick: $event => $options.click(lang)
    }, (0,shared_esm_bundler/* toDisplayString */.v_)(lang), 9, LanguageContainervue_type_template_id_0590a3a4_hoisted_2);
  }), 128))]);
}
;// CONCATENATED MODULE: ./src/components/LanguageContainer.vue?vue&type=template&id=0590a3a4

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/LanguageContainer.vue?vue&type=script&lang=js

/* harmony default export */ var LanguageContainervue_type_script_lang_js = ({
  emits: ['lang'],
  data() {
    return {
      langs: getLanguageNames()
    };
  },
  methods: {
    click(lang) {
      this.$emit('lang', lang);
    }
  }
});
;// CONCATENATED MODULE: ./src/components/LanguageContainer.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/LanguageContainer.vue




;
const LanguageContainer_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(LanguageContainervue_type_script_lang_js, [['render',LanguageContainervue_type_template_id_0590a3a4_render]])

/* harmony default export */ var LanguageContainer = (LanguageContainer_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ColorContainer.vue?vue&type=template&id=9fdd7b78&scoped=true

const ColorContainervue_type_template_id_9fdd7b78_scoped_true_withScopeId = n => (_pushScopeId("data-v-9fdd7b78"), n = n(), _popScopeId(), n);
const ColorContainervue_type_template_id_9fdd7b78_scoped_true_hoisted_1 = {
  class: "colors margin-tb-2"
};
const ColorContainervue_type_template_id_9fdd7b78_scoped_true_hoisted_2 = ["onClick"];
function ColorContainervue_type_template_id_9fdd7b78_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", ColorContainervue_type_template_id_9fdd7b78_scoped_true_hoisted_1, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($data.colors, (color, key) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", {
      style: (0,shared_esm_bundler/* normalizeStyle */.Tr)({
        'background-color': color.background
      }),
      class: "color-box box circle margin-1 hover active pointer",
      key: key,
      onClick: $event => $options.click(key, color)
    }, null, 12, ColorContainervue_type_template_id_9fdd7b78_scoped_true_hoisted_2);
  }), 128))]);
}
;// CONCATENATED MODULE: ./src/components/ColorContainer.vue?vue&type=template&id=9fdd7b78&scoped=true

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ColorContainer.vue?vue&type=script&lang=js

/* harmony default export */ var ColorContainervue_type_script_lang_js = ({
  emits: ['color'],
  data() {
    return {
      colors: colors
    };
  },
  methods: {
    click(name, color) {
      this.$emit('color', name, color);
    }
  }
});
;// CONCATENATED MODULE: ./src/components/ColorContainer.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ColorContainer.vue?vue&type=style&index=0&id=9fdd7b78&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/ColorContainer.vue?vue&type=style&index=0&id=9fdd7b78&lang=scss&scoped=true

;// CONCATENATED MODULE: ./src/components/ColorContainer.vue




;


const ColorContainer_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(ColorContainervue_type_script_lang_js, [['render',ColorContainervue_type_template_id_9fdd7b78_scoped_true_render],['__scopeId',"data-v-9fdd7b78"]])

/* harmony default export */ var ColorContainer = (ColorContainer_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/LinkContainer.vue?vue&type=template&id=3455d64f

const LinkContainervue_type_template_id_3455d64f_hoisted_1 = ["href"];
function LinkContainervue_type_template_id_3455d64f_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_fa = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("v-fa");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", null, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($data.links, link => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("a", {
      href: link.url,
      target: "_blank",
      class: "box circle margin-1 hover active",
      key: link.url
    }, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
      icon: link.icon
    }, null, 8, ["icon"]), (0,runtime_core_esm_bundler/* createTextVNode */.eW)(" " + (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t(link.text)), 1)], 8, LinkContainervue_type_template_id_3455d64f_hoisted_1);
  }), 128))]);
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/LinkContainer.vue?vue&type=script&lang=js
/* harmony default export */ var LinkContainervue_type_script_lang_js = ({
  data() {
    return {
      links: [{
        url: 'https://bit.ly/3rMhwKT',
        icon: ['fas', 'share-alt-square'],
        text: 'link-share-on-twitter'
      }, {
        url: 'https://twitter.com/irokaru',
        icon: ['fab', 'twitter'],
        text: 'link-developer'
      }, {
        url: 'https://github.com/irokaru/pixel-scaler',
        icon: ['fab', 'github'],
        text: 'link-repository'
      }, {
        url: 'https://nononotyaya.booth.pm/items/2517679',
        icon: ['fas', 'images'],
        text: 'link-booth'
      }, {
        url: './oss-licenses.json',
        icon: ['fas', 'balance-scale'],
        text: 'link-license'
      }]
    };
  }
});
;// CONCATENATED MODULE: ./src/components/LinkContainer.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/LinkContainer.vue




;
const LinkContainer_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(LinkContainervue_type_script_lang_js, [['render',LinkContainervue_type_template_id_3455d64f_render]])

/* harmony default export */ var LinkContainer = (LinkContainer_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/VersionContainer.vue?vue&type=template&id=dc7e3f8a

const VersionContainervue_type_template_id_dc7e3f8a_hoisted_1 = {
  class: "box block"
};
const VersionContainervue_type_template_id_dc7e3f8a_hoisted_2 = {
  key: 0
};
const VersionContainervue_type_template_id_dc7e3f8a_hoisted_3 = ["innerHTML"];
const VersionContainervue_type_template_id_dc7e3f8a_hoisted_4 = {
  key: 2
};
function VersionContainervue_type_template_id_dc7e3f8a_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_fa = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("v-fa");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", VersionContainervue_type_template_id_dc7e3f8a_hoisted_1, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: "times-circle",
    class: "close-btn pointer",
    onClick: _cache[0] || (_cache[0] = $event => _ctx.$emit('close'))
  }), !$props.checkUpdate ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("p", VersionContainervue_type_template_id_dc7e3f8a_hoisted_2, (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('version-check')), 1)) : $props.isLatest ? ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, {
    key: 1
  }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("p", null, (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('version-new-notice', {
    version: $props.latestVersion
  })), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("p", {
    innerHTML: _ctx.$t('version-new-download', {
      booth: 'https://nononotyaya.booth.pm/items/2517679',
      github: 'https://github.com/irokaru/pixel-scaler/releases'
    })
  }, null, 8, VersionContainervue_type_template_id_dc7e3f8a_hoisted_3)], 64)) : ((0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("p", VersionContainervue_type_template_id_dc7e3f8a_hoisted_4, (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('version-latest-now')), 1))]);
}
;// CONCATENATED MODULE: ./src/components/VersionContainer.vue?vue&type=template&id=dc7e3f8a

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/VersionContainer.vue?vue&type=script&lang=js
/* harmony default export */ var VersionContainervue_type_script_lang_js = ({
  props: {
    checkUpdate: {
      type: Boolean,
      required: true
    },
    isLatest: {
      type: Boolean,
      required: true
    },
    latestVersion: {
      type: String,
      required: true
    }
  },
  emits: ['close']
});
;// CONCATENATED MODULE: ./src/components/VersionContainer.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/VersionContainer.vue




;
const VersionContainer_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(VersionContainervue_type_script_lang_js, [['render',VersionContainervue_type_template_id_dc7e3f8a_render]])

/* harmony default export */ var VersionContainer = (VersionContainer_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ExceptionContainer.vue?vue&type=template&id=ac6b477e

const ExceptionContainervue_type_template_id_ac6b477e_hoisted_1 = {
  class: "box-reverse block selectable-all"
};
function ExceptionContainervue_type_template_id_ac6b477e_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_v_fa = (0,runtime_core_esm_bundler/* resolveComponent */.g2)("v-fa");
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, [(0,runtime_core_esm_bundler/* createVNode */.bF)(_component_v_fa, {
    icon: "times-circle",
    class: "close-btn pointer",
    onClick: _cache[0] || (_cache[0] = $event => _ctx.$emit('close'))
  }), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("p", null, (0,shared_esm_bundler/* toDisplayString */.v_)(_ctx.$t('exception')), 1), (0,runtime_core_esm_bundler/* createElementVNode */.Lk)("pre", ExceptionContainervue_type_template_id_ac6b477e_hoisted_1, (0,shared_esm_bundler/* toDisplayString */.v_)($props.exception), 1)], 64);
}
;// CONCATENATED MODULE: ./src/components/ExceptionContainer.vue?vue&type=template&id=ac6b477e

;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/ExceptionContainer.vue?vue&type=script&lang=js
/* harmony default export */ var ExceptionContainervue_type_script_lang_js = ({
  props: {
    exception: {
      required: true
    }
  },
  emits: ['close']
});
;// CONCATENATED MODULE: ./src/components/ExceptionContainer.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/ExceptionContainer.vue




;
const ExceptionContainer_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(ExceptionContainervue_type_script_lang_js, [['render',ExceptionContainervue_type_template_id_ac6b477e_render]])

/* harmony default export */ var ExceptionContainer = (ExceptionContainer_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/PreviewContainer.vue?vue&type=template&id=7676aa26&scoped=true

const PreviewContainervue_type_template_id_7676aa26_scoped_true_withScopeId = n => (_pushScopeId("data-v-7676aa26"), n = n(), _popScopeId(), n);
const PreviewContainervue_type_template_id_7676aa26_scoped_true_hoisted_1 = ["src"];
function PreviewContainervue_type_template_id_7676aa26_scoped_true_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", {
    class: "preview-wrapper",
    onClick: _cache[0] || (_cache[0] = $event => _ctx.$emit('close'))
  }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("img", {
    src: $props.image
  }, null, 8, PreviewContainervue_type_template_id_7676aa26_scoped_true_hoisted_1)]);
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/PreviewContainer.vue?vue&type=script&lang=js
/* harmony default export */ var PreviewContainervue_type_script_lang_js = ({
  props: {
    image: {
      type: String,
      required: true
    }
  },
  emits: ['close']
});
;// CONCATENATED MODULE: ./src/components/PreviewContainer.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/PreviewContainer.vue?vue&type=style&index=0&id=7676aa26&lang=scss&scoped=true
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/components/PreviewContainer.vue?vue&type=style&index=0&id=7676aa26&lang=scss&scoped=true

;// CONCATENATED MODULE: ./src/components/PreviewContainer.vue




;


const PreviewContainer_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(PreviewContainervue_type_script_lang_js, [['render',PreviewContainervue_type_template_id_7676aa26_scoped_true_render],['__scopeId',"data-v-7676aa26"]])

/* harmony default export */ var PreviewContainer = (PreviewContainer_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/FileInput.vue?vue&type=template&id=395af975

function FileInputvue_type_template_id_395af975_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("label", {
    class: "box circle hover active pointer flex-grow-1 margin-tb-1",
    onDragover: _cache[2] || (_cache[2] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)(() => {}, ["prevent"])),
    onDrop: _cache[3] || (_cache[3] = (0,runtime_dom_esm_bundler/* withModifiers */.D$)((...args) => $options.onDrop && $options.onDrop(...args), ["prevent"]))
  }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
    type: "file",
    accept: "image/png, image/jpeg, image/gif",
    multiple: "",
    onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args)),
    onChange: _cache[1] || (_cache[1] = (...args) => $options.onChange && $options.onChange(...args))
  }, null, 32), (0,runtime_core_esm_bundler/* renderSlot */.RG)(_ctx.$slots, "default")], 32);
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/FileInput.vue?vue&type=script&lang=js


const acceptedTypes = ["image/png", "image/gif", "image/jpeg"];
const pickerOpts = {
  types: [{
    description: 'Images',
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg']
    }
  }],
  excludeAcceptAllOption: true,
  multiple: true
};

/**
 * A input wrapper for file upload that uses the File System API.
 *  Will fallbacks to native event upload if the File System API is not supported on the browser.
 *
 * @emits filechange Fires when files are uploaded. File handles are sent as the argument
 */
/* harmony default export */ var FileInputvue_type_script_lang_js = ({
  data() {
    return {
      hasFileSystemAccess: !!window.showOpenFilePicker,
      files: []
    };
  },
  methods: {
    // For browsers with File System Access API (chrome, edge)
    async onClick(e) {
      if (this.hasFileSystemAccess) {
        e.preventDefault();
        const fileHandles = await window.showOpenFilePicker(pickerOpts);
        this.$emit("filechange", fileHandles);
      }
    },
    async onDrop(e) {
      if (this.hasFileSystemAccess) {
        e.preventDefault();
        let fileHandles = [];
        const items = [...e.dataTransfer.items];
        for (const item of items) {
          if (item.kind !== "file" || !acceptedTypes.includes(item.type)) {
            console.warn("Unsupported file type dropped");
            continue;
          }
          const fileHandle = await transferItemToHandle(item);
          if (fileHandle) fileHandles.push(fileHandle);
        }
        this.$emit("filechange", fileHandles);
      } else {
        this.onChange(e);
      }
    },
    // For browsers without the File System Access API (Firefox, webkit)
    onChange(e) {
      if (!this.hasFileSystemAccess) {
        const files = Array.from(e.target.files || e.dataTransfer.files);
        const handles = files.map(f => new NativeFileHandle(f));
        this.$emit("filechange", handles);
      }
    }
  },
  emits: ["filechange"]
});
;// CONCATENATED MODULE: ./src/components/form/FileInput.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/form/FileInput.vue




;
const FileInput_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(FileInputvue_type_script_lang_js, [['render',FileInputvue_type_template_id_395af975_render]])

/* harmony default export */ var FileInput = (FileInput_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/Radio.vue?vue&type=template&id=3864eb3a

const Radiovue_type_template_id_3864eb3a_hoisted_1 = ["name", "value", "checked"];
function Radiovue_type_template_id_3864eb3a_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("div", null, [((0,runtime_core_esm_bundler/* openBlock */.uX)(true), (0,runtime_core_esm_bundler/* createElementBlock */.CE)(runtime_core_esm_bundler/* Fragment */.FK, null, (0,runtime_core_esm_bundler/* renderList */.pI)($props.options, (value, key) => {
    return (0,runtime_core_esm_bundler/* openBlock */.uX)(), (0,runtime_core_esm_bundler/* createElementBlock */.CE)("label", {
      key: key,
      class: (0,shared_esm_bundler/* normalizeClass */.C4)(["radio box active hover", [$options.isChecked(key) ? 'checked' : '']])
    }, [(0,runtime_core_esm_bundler/* createElementVNode */.Lk)("input", {
      type: "radio",
      name: $props.name,
      value: key,
      checked: $options.isChecked(key),
      onChange: _cache[0] || (_cache[0] = (...args) => $options.onChange && $options.onChange(...args))
    }, null, 40, Radiovue_type_template_id_3864eb3a_hoisted_1), (0,runtime_core_esm_bundler/* createTextVNode */.eW)((0,shared_esm_bundler/* toDisplayString */.v_)($props.trans ? _ctx.$t(value) : value), 1)], 2);
  }), 128))]);
}
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/components/form/Radio.vue?vue&type=script&lang=js
/**
 * @emits name form name
 * @emits modelValue v-model
 * @emits options {key: value} object
 */
/* harmony default export */ var Radiovue_type_script_lang_js = ({
  name: 'formSelect',
  props: {
    name: {
      type: String,
      required: true
    },
    modelValue: {
      type: [String, Number],
      required: true
    },
    trans: {
      type: Boolean,
      required: false,
      default: false
    },
    options: {
      type: Object,
      required: true
    }
  },
  methods: {
    /**
     * 入力時に発火させるやつ
     * @returns {void}
     */
    onChange(e) {
      const value = e.target.value;
      this.$emit('update:modelValue', value);
    },
    /**
     * チェックされているものか
     * @param {string|number} key
     * @returns {boolean}
     */
    isChecked(key) {
      return this.modelValue == key;
    }
  }
});
;// CONCATENATED MODULE: ./src/components/form/Radio.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./src/components/form/Radio.vue




;
const Radio_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(Radiovue_type_script_lang_js, [['render',Radiovue_type_template_id_3864eb3a_render]])

/* harmony default export */ var Radio = (Radio_exports_);
;// CONCATENATED MODULE: ./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[1]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=script&lang=js






















const __default__ = {
  name: 'app',
  data() {
    return {
      zoom: {
        list: {
          '1': '1px',
          '2': '2px',
          '3': '3px',
          '4': '4px'
        },
        org: 1
      },
      scale: 200,
      scaleMode: 'xbr',
      scaleModes: {
        xbr: 'scale-mode-xbr',
        nn: 'scale-mode-nn'
      },
      fileHandles: [],
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
        showPreviewConverted: false
      },
      color: getDefaultColorValues()
    };
  },
  methods: {
    /**
     * ファイル配列を変数に入れるやつ
     * @param {FileSystemFileHandle[]} fileHandles An array of FileHandles
     * @returns {void}
     */
    setFiles(fileHandles) {
      this.fileHandles = fileHandles;
      this.exception = '';
    },
    /**
     * 実際に拡大縮小するやつ
     * @returns {void}
     */
    async convert() {
      this.exception = '';
      [this.pixel, this.scale] = adjustParams(this.pixel, this.scale);
      if (this.flags.convert || this.fileHandles.length === 0) {
        return;
      }
      this.flags.convert = true;
      for (const fileHandle of this.fileHandles) {
        try {
          const file = await fileHandle.getFile();
          const scaled = await PictureScale_scale(file, this.scale, this.zoom.org, this.scaleMode);
          scaled.status === 'success' ? this.converted.push(scaled) : this.errors.push(scaled);
        } catch (e) {
          console.log(e);
          this.exception = e;
          break;
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
      this.converted.splice(index, 1)[0]?.unload();
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
      for (const convert of this.converted) {
        convert.unload();
      }
      this.fileHandles = [];
      this.converted = [];
      this.errors = [];
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
     * @param {string} lang
     * @returns {void}
     */
    setLang(lang) {
      if (!setDefaultLanguage(lang)) return;
      this.$i18n.locale = lang;
      this.updateOgp(lang);
    },
    /**
     * OGP情報を更新する
     * @param {string} lang
     * @returns {void}
     */
    updateOgp(lang) {
      document.title = this.$t('title');
      setOgpValue('og:title', this.$t('title'));
      setOgpValue('og:site_name', this.$t('title'));
      setOgpValue('og:description', this.$t('ogp-description'));
      setOgpValue('og:locale', lang);
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
    isWeb() {
      return isWeb();
    },
    /**
     * electronかどうか
     * @returns {boolean}
     */
    isElectron() {
      return isElectron();
    },
    /**
     * steam向けかどうか
     * @returns {boolean}
     */
    isUnite() {
      return isUnite();
    },
    /**
     * バージョンアップが必要かどうか
     * @returns {Promise<string>}
     */
    checkUpdate() {
      return checkVersion();
    },
    /**
     * 今年の年を返す
     * @returns {number}
     */
    year() {
      return new Date().getFullYear();
    }
  },
  async created() {
    this.updateOgp(this.$t.locale);
    if (this.isWeb()) return;
    this.latestVersion = await this.checkUpdate();
    this.flags.checkUpdate = true;
  },
  components: {
    LoadingPart: LoadingPart,
    AttentionContainer: AttentionContainer,
    HowtoContainer: HowtoContainer,
    ImageContainer: ImageContainer,
    LanguageContainer: LanguageContainer,
    ColorContainer: ColorContainer,
    LinkContainer: LinkContainer,
    VersionContainer: VersionContainer,
    ExceptionContainer: ExceptionContainer,
    PreviewContainer: PreviewContainer,
    FormFileInput: FileInput,
    FormRadio: Radio
  }
};

const __injectCSSVars__ = () => {
  (0,runtime_dom_esm_bundler/* useCssVars */.$9)(_ctx => ({
    "13ad3072": _ctx.color.font,
    "0e249311": _ctx.color.background,
    "6a71760c": _ctx.color.edgeBright,
    "318de1c0": _ctx.color.edgeShadow,
    "3ebbf171": _ctx.color.scrollbarBackground,
    "37aeaee3": _ctx.color.scrollbarShadow,
    "01da37b3": _ctx.color.scrollbarThumb
  }));
};
const __setup__ = __default__.setup;
__default__.setup = __setup__ ? (props, ctx) => {
  __injectCSSVars__();
  return __setup__(props, ctx);
} : __injectCSSVars__;
/* harmony default export */ var Appvue_type_script_lang_js = (__default__);
;// CONCATENATED MODULE: ./src/App.vue?vue&type=script&lang=js
 
;// CONCATENATED MODULE: ./node_modules/mini-css-extract-plugin/dist/loader.js??clonedRuleSet-22.use[0]!./node_modules/css-loader/dist/cjs.js??clonedRuleSet-22.use[1]!./node_modules/vue-loader/dist/stylePostLoader.js!./node_modules/postcss-loader/dist/cjs.js??clonedRuleSet-22.use[2]!./node_modules/sass-loader/dist/cjs.js??clonedRuleSet-22.use[3]!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[0]!./src/App.vue?vue&type=style&index=0&id=75d5146f&lang=scss
// extracted by mini-css-extract-plugin

;// CONCATENATED MODULE: ./src/App.vue?vue&type=style&index=0&id=75d5146f&lang=scss

;// CONCATENATED MODULE: ./src/App.vue




;


const App_exports_ = /*#__PURE__*/(0,exportHelper/* default */.A)(Appvue_type_script_lang_js, [['render',render]])

/* harmony default export */ var App = (App_exports_);
// EXTERNAL MODULE: ./node_modules/@fortawesome/fontawesome-svg-core/index.es.js
var index_es = __webpack_require__(6429);
// EXTERNAL MODULE: ./node_modules/@fortawesome/free-solid-svg-icons/index.es.js
var free_solid_svg_icons_index_es = __webpack_require__(2630);
// EXTERNAL MODULE: ./node_modules/@fortawesome/free-regular-svg-icons/index.es.js
var free_regular_svg_icons_index_es = __webpack_require__(9075);
// EXTERNAL MODULE: ./node_modules/@fortawesome/free-brands-svg-icons/index.es.js
var free_brands_svg_icons_index_es = __webpack_require__(2403);
// EXTERNAL MODULE: ./node_modules/@fortawesome/vue-fontawesome/index.es.js
var vue_fontawesome_index_es = __webpack_require__(1273);
// EXTERNAL MODULE: ./node_modules/vue-gtag/dist/vue-gtag.esm.js
var vue_gtag_esm = __webpack_require__(7073);
;// CONCATENATED MODULE: ./src/main.js


__webpack_require__(2304);









// ---------------------------------------------------------------

index_es/* library */.Yv.add(free_solid_svg_icons_index_es/* fas */.X7I, free_regular_svg_icons_index_es/* far */.C9, free_brands_svg_icons_index_es/* fab */.Cvc);
const app = (0,runtime_dom_esm_bundler/* createApp */.Ef)(App);
app.component('v-fa', vue_fontawesome_index_es/* FontAwesomeIcon */.gc);
app.use(i18n);
if (isWeb() && "G-1KZRGEYWQ7") app.use(vue_gtag_esm/* default */.Ay, {
  config: {
    id: "G-1KZRGEYWQ7"
  }
});
app.mount('#app');

/***/ }),

/***/ 8330:
/***/ (function(module) {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"pixel-scaler","version":"1.0.1","private":true,"description":"pixel art scale app","author":{"name":"irokaru","url":"https://nononotyaya.net/"},"scripts":{"serve":"vue-cli-service serve","build":"vue-cli-service build","lint":"vue-cli-service lint","deploy":"yarn build && gh-pages -d dist","electron:build":"vue-cli-service electron:build","electron:serve":"vue-cli-service electron:serve","license":"node src/license.js","postinstall":"electron-builder install-app-deps","postuninstall":"electron-builder install-app-deps","test":"vue-cli-service test:unit"},"main":"background.js","dependencies":{"@fortawesome/fontawesome-svg-core":"^1.2.32","@fortawesome/vue-fontawesome":"^3.0.0-2","caniuse-lite":"^1.0.30001699","core-js":"^3.6.5","file-saver":"^2.0.2","jszip":"^3.5.0","vue":"^3.0.0","vue-i18n":"^9.2.0-beta.26","xbr-js":"^2.0.1"},"devDependencies":{"@babel/core":"^7.12.16","@babel/eslint-parser":"^7.12.16","@fortawesome/free-brands-svg-icons":"^5.15.1","@fortawesome/free-regular-svg-icons":"^5.15.1","@fortawesome/free-solid-svg-icons":"^5.15.1","@vue/cli-plugin-babel":"~5.0.8","@vue/cli-plugin-eslint":"~5.0.8","@vue/cli-plugin-unit-jest":"~5.0.8","@vue/cli-service":"~5.0.8","@vue/compiler-sfc":"^3.0.0","@vue/test-utils":"^2.0.0-0","@vue/vue3-jest":"28","electron":"^9.0.0","electron-devtools-installer":"^3.1.0","eslint":"^7.32.0","eslint-plugin-vue":"^8.0.3","gh-pages":"^3.1.0","husky":"^4.3.0","jest":"^27.1.0","nonono-validator":"irokaru/nonono-validator","sass":"^1.49.0","sass-loader":"^8.0.0","vue-cli-plugin-electron-builder":"~2.1.1","vue-gtag":"^2.0.1","vue-jest":"^5.0.0-0","vue-template-compiler":"^2.6.10","webpack-license-plugin":"^4.2.1"},"eslintConfig":{"root":true,"env":{"node":true},"extends":["plugin:vue/vue3-essential","eslint:recommended"],"rules":{"no-console":0,"semi":["error","always"],"semi-spacing":["error",{"after":true,"before":false}],"semi-style":["error","last"],"no-extra-semi":"error","no-unexpected-multiline":"error","no-unreachable":"error"},"parserOptions":{"parser":"@babel/eslint-parser"},"overrides":[{"files":["**/__tests__/*.{j,t}s?(x)","**/tests/unit/**/*.spec.{j,t}s?(x)"],"env":{"jest":true}}]},"browserslist":["> 1%","last 2 versions"],"husky":{"hooks":{"pre-commit":"yarn lint"}}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	!function() {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = function(result, chunkIds, fn, priority) {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every(function(key) { return __webpack_require__.O[key](chunkIds[j]); })) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	!function() {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			524: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = function(chunkId) { return installedChunks[chunkId] === 0; };
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some(function(id) { return installedChunks[id] !== 0; })) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkpixel_scaler"] = self["webpackChunkpixel_scaler"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [504], function() { return __webpack_require__(8062); })
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=app.a6fedea1.js.map