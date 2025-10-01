/// <reference types="vitest" />

import { fileURLToPath } from "node:url";

import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue(), tsconfigPaths()],
  test: {
    globals: true,
    setupFiles: ["tests/unit/vitest.setup.ts"],
    environment: "happy-dom",
    include: ["tests/unit/**/*.spec.ts"],
    reporters: process.env.GITHUB_ACTIONS
      ? [["junit", { outputFile: "coverage/test-report.junit.xml" }]]
      : [],
    coverage: {
      exclude: [
        "src-tauri",
        "tests/e2e",
        "playwright-report",
        "playwright.config.ts",
        "**/__mocks__",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
});
