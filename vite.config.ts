import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { RootNode, TemplateChildNode } from "@vue/compiler-core";
import Unfonts from "unplugin-fonts/vite";
import { defineConfig } from "vite";

import { version } from "./package.json";
import generateLicensePlugin from "./vite/plugins/license";

/**
 * Removes `data-testid` attributes from a given node's properties.
 * This function filters out both static (`data-testid`) and dynamic (`:data-testid`) attributes
 * from the `props` array of the provided node, if applicable.
 *
 * @param node - The node to process, which can be either a `RootNode` or a `TemplateChildNode`.
 *               If the node's type is not 1, the function will return without making changes.
 */
const removeDataTestAttrs = (node: RootNode | TemplateChildNode) => {
  if (node.type !== 1) return;

  node.props = node.props.filter((prop) => {
    if (prop.type === 6) return prop.name !== "data-testid";
    if (prop.type === 7) return prop.rawName !== ":data-testid";
    return true;
  });
};

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
    generateLicensePlugin({
      outputDir: "dist",
      fileName: "THIRD_PARTY_LICENSES",
    }),
  ],
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(version),
    __VUE_OPTIONS_API__: false,
  },
  base: "./",
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
}));
