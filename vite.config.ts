import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";

import { version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Unfonts({
      google: {
        families: [
          {
            name: "Kosugi",
          },
        ],
      },
    }),
  ],
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(version),
    __VUE_OPTIONS_API__: false,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
});
