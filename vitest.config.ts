/// <reference types="vitest" />

import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    setupFiles: ["tests/vitest.setup.ts"],
    environment: "happy-dom",
    reporters: process.env.GITHUB_ACTIONS ? ["github-actions"] : [],
    coverage: {
      exclude: ["src-tauri", ...coverageConfigDefaults.exclude],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
});
