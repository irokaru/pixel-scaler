import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";

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
