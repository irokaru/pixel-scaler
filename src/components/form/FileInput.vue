<template>
  <label class="box circle hover active pointer flex-grow-1 margin-tb-1" @dragover.prevent @drop.prevent="onDrop">
    <input type="file" accept="image/png, image/jpeg, image/gif" multiple @click="onClick" @change="onChange">
    <!-- @slot Use this for the label text -->
    <slot></slot>
  </label>
</template>
<script>
import { NativeFileHandle, transferItemToHandle } from '../../lib/FileUtil';

const acceptedTypes = [
  "image/png",
  "image/gif",
  "image/jpeg"
];

const pickerOpts = {
  types: [
    {
      description: 'Images',
      accept: {
        'image/*': ['.png', '.gif', '.jpeg', '.jpg']
      }
    },
  ],
  excludeAcceptAllOption: true,
  multiple: true
};

/**
 * A input wrapper for file upload that uses the File System API.
 *  Will fallbacks to native event upload if the File System API is not supported on the browser.
 *
 * @emits filechange Fires when files are uploaded. File handles are sent as the argument
 */
export default {
  data() {
    return {
      hasFileSystemAccess: !!window.showOpenFilePicker,
      files: [],
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
    },

  },
  emits: ["filechange"]
};
</script>
