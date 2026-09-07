---
type: Playbook
title: Theme Contribution Playbook
description: Step-by-step workflow for adding a color theme.
tags: [contributing, theme, colors]
resource: src/core/config/colors/index.ts
sources:
  - resource: src/core/config/colors/index.ts
    id: color-registry
  - resource: src/core/services/colorService.ts
    id: color-service
  - resource: src/core/types/color.ts
    id: color-types
generated:
  by: human:maintainer
  at: 2026-09-07T00:00:00Z
status: stable
---

# Theme Contribution Playbook

## Background

Themes are JSON files registered in a central registry and applied as CSS variables. Components must use `var(--color-*)` references inside `<style lang="scss" scoped>` blocks and never hardcode hex colors, so every theme automatically restyles the whole app.

## Workflow

1. Create a theme JSON (e.g. `src/core/config/colors/orange.json`) with the seven required keys: `font`, `background`, `edgeBright`, `edgeShadow`, `scrollbarBackground`, `scrollbarShadow`, `scrollbarThumb` (mirror `src/core/config/colors/red.json`).
2. If the theme needs a dark variant, add a second `<name>_dark.json` following the `red_dark` / `blue_dark` / `green_dark` pattern.
3. Import both files in `src/core/config/colors/index.ts` and add the keys to `ColorKeys` and the `Colors` record.
4. Extend the `ColorKey` union in `src/core/types/color.ts` with the new key names.
5. Verify selection and persistence work through `src/core/services/colorService.ts` (stored under `StorageKey "color"`, default `"red"`) and that components pick up the new theme with no hardcoded colors.

## Gotchas

* Note: `gray` ships without a `_dark` variant, so dark pairing is conventional rather than enforced — check whether the new theme truly needs one.
* Unknown stored keys fall back to the default, so a typo in the registry fails silently to `red`.

## References

* `src/core/config/colors/index.ts` — registry, `ColorKeys`, `StorageKey`, default key
* `src/core/config/colors/red.json` — schema example for the seven keys
* `src/core/services/colorService.ts` — load/save/validate helpers
* `src/core/types/color.ts` — `ColorKey` and `ColorSettings` types
* `src/assets/global.scss` — CSS variable application
