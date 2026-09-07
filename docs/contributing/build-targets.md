---
type: Reference
title: Build Targets & Environment Matrix
description: Commands and environment flags for PWA, standalone, and Tauri builds.
tags: [contributing, build, pwa, tauri]
resource: vite.config.ts
sources:
  - resource: vite.config.ts
    id: vite-config
  - resource: vite/config/pwa.ts
    id: pwa-config
  - resource: src-tauri/tauri.conf.json
    id: tauri-config
generated:
  by: human:maintainer
  at: 2026-09-07T00:00:00Z
status: stable
---

# Build Targets & Environment Matrix

## Background

The app ships as a web PWA, a standalone web build, and a Tauri desktop app. All image processing runs client-side and offline, so builds differ only in packaging and environment flags.

## Catalog

| Command | Output |
|---|---|
| `bun run dev` | Local dev server (web) |
| `bun run dev:tauri` | Local dev server (Tauri) |
| `bun run build` | PWA production build |
| `bun run build:standalone` | Standalone build (`vite build --mode standalone`, different env vars) |
| `bun run build:tauri` | Tauri desktop application |
| `bun run preview` | Preview the production build locally |
| `bun run test` / `test:e2e` | Unit tests (Vitest) / end-to-end tests (Playwright) |

* PWA behavior (`vite/config/pwa.ts`): `autoUpdate` registration, font runtime caching, manifest scope and start URL `/pixel-scaler/`, installable icons.
* Setting `VITE_PWA_DISABLED=true` excludes the PWA plugin from the build (`vite.config.ts`); the app base is `"./"` for portable paths.

## Gotchas

* Gap: no `.env` or `.env.standalone` files were found in the repo, so the exact standalone env-var differences are unverified — check the build mode and hosting setup when values matter.

## References

* `vite.config.ts` — build commands wiring, `VITE_PWA_DISABLED` flag, `base: "./"`
* `vite/config/pwa.ts` — manifest, scope, workbox caching
* `src-tauri/tauri.conf.json` — desktop app configuration
* `package.json` — full script list
