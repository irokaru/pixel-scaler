import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import { version } from "./package.json" with { type: "json" };
import { pwaConfig } from "./vite/config/pwa.ts";
import { removeDataTestAttrs as removeDataTestAttributes } from "./vite/config/removeDataTestAttrs.ts";
import generateLicensePlugin from "./vite/plugins/license.ts";

// https://vitejs.dev/config/
export default defineConfig((configEnvironment) => ({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          nodeTransforms:
            configEnvironment.mode === "production"
              ? [removeDataTestAttributes]
              : [],
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
    ...(process.env.VITE_PWA_DISABLED === "true" ? [] : [VitePWA(pwaConfig)]),
    generateLicensePlugin(
      configEnvironment.mode === "standalone"
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
