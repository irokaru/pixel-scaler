/// <reference types="vitest" />

import { defineConfig } from "vite";

import viteConfig from "./vite.config";

export default defineConfig({
  ...viteConfig,
  test: {
    globals: true,
    environment: "happy-dom",
    reporters: process.env.GITHUB_ACTIONS ? ["github-actions"] : [],
  },
});
