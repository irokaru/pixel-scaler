import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import { version } from "./package.json";
import { pwaConfig } from "./vite/config/pwa";
import { removeDataTestAttrs } from "./vite/config/removeDataTestAttrs";
import generateLicensePlugin from "./vite/plugins/license";

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          nodeTransforms:
            configEnv.mode === "production" ? [removeDataTestAttrs] : [],
        },
      },
    }),
    Unfonts({
      google: {
        families: [
          {
            name: "Kosugi",
          },
        ],
      },
    }),
    VitePWA(pwaConfig),
    generateLicensePlugin(
      configEnv.mode === "standalone"
        ? {
            outputDir: "dist",
            fileName: "THIRD_PARTY_LICENSES.txt",
            format: "text",
          }
        : {
            outputDir: "dist",
            fileName: "THIRD_PARTY_LICENSES.html",
            format: "html",
          },
    ),
  ],
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(version),
    __VUE_OPTIONS_API__: false,
  },
  base: "./",
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
}));
