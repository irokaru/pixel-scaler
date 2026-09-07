---
type: Playbook
title: i18n Contribution Playbook
description: Step-by-step workflow for adding a locale.
tags: [contributing, i18n, locale]
resource: src/core/config/i18n/index.ts
sources:
  - resource: src/core/config/i18n/index.ts
    id: i18n-registry
  - resource: src/plugins/i18n.ts
    id: i18n-plugin
  - resource: src/core/services/i18nService.ts
    id: i18n-service
generated:
  by: human:maintainer
  at: 2026-09-07T00:00:00Z
status: stable
---

# i18n Contribution Playbook

## Background

All UI text goes through `vue-i18n` keys; hardcoded user-facing strings are not allowed. Five locales ship today (`ja`, `en`, `cn`, `es`, `tr`), with `en` as the default and fallback locale (`src/plugins/i18n.ts`, `src/core/config/i18n/index.ts`).

## Workflow

1. Copy `src/core/config/i18n/en.json` to a new `<locale>.json` and translate every value, keeping all key paths identical (dotted convention like `form.scale-modes.smooth`, `error.input.encoding-error`).
2. Register the locale in `src/core/config/i18n/index.ts` (`Languages`; add to `LanguagesForUnite` too if it should ship in the unite build).
3. Use keys via `t('key.path')` in templates and scripts; error messages must use `error.<kind>.<code>` keys only.
4. Verify the app renders with the device language set to the new locale, and that missing keys fall back to English (`fallbackLocale: DefaultLanguage`, persisted under `StorageKey "language"`).

## Gotchas

* A renamed or dropped key breaks every locale at once — add keys to `en.json` first, then propagate.
* When possible, add both `en` and `ja` keys for any new UI text.

## References

* `src/core/config/i18n/index.ts` — `Languages`, `LanguagesForUnite`, `StorageKey`, `DefaultLanguage`
* `src/core/config/i18n/en.json` — canonical key set to mirror
* `src/plugins/i18n.ts` — locale loading and English fallback
* `src/core/services/i18nService.ts` — language load/save helpers
