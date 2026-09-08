---
type: Reference
title: Error Code → i18n Key Catalog
description: Every error kind and code mapped to its user-facing i18n key.
tags: [lifecycle, errors, i18n, catalog]
resource: src/core/models/errors/InputError.ts
sources:
  - resource: src/core/models/errors/InputError.ts
    id: input-errors
  - resource: src/core/models/errors/FileError.ts
    id: file-errors
  - resource: src/core/models/errors/ScaleError.ts
    id: scale-errors
  - resource: src/core/models/errors/UnknownError.ts
    id: unknown-errors
  - resource: src/core/config/i18n/en.json
    id: error-messages
generated:
  by: human:maintainer
  at: 2026-09-07T00:00:00Z
status: stable
---

# Error Code → i18n Key Catalog

## Background

Serialized errors use the key shape `error.<kind>.<code>` (see `CustomErrorBase.toObject()`), resolved against the locale files in `src/core/config/i18n/`. Every code below was verified against both the error class declarations and `en.json`.

## Catalog

| Kind | Code | i18n key | Scope |
|---|---|---|---|
| `input` | `invalid-image-type` | `error.input.invalid-image-type` | global |
| `input` | `encoding-error` | `error.input.encoding-error` | global |
| `input` | `file-not-found` | `error.input.file-not-found` | global |
| `input` | `canvas-is-unsupported` | `error.input.canvas-is-unsupported` | global |
| `input` | `invalid-image-size` | `error.input.invalid-image-size` | global |
| `file` | `duplicate-image` | `error.file.duplicate-image` | global |
| `scale` | `invalid-image-size` | `error.scale.invalid-image-size` | entry |
| `scale` | `unsupported-scale-size` | `error.scale.unsupported-scale-size` | entry |
| `scale` | `duplicate-image-and-settings` | `error.scale.duplicate-image-and-settings` | entry |
| `unknown` | `unknown` | `error.unknown.unknown` | global |

* Entry scope means the error is recorded on the entry during conversion (retryable); global scope means it goes to the global error store (dismissable). See [Error Handling Model](error-model.md).
* All ten codes resolve in `en.json`; the other locales (`ja`, `cn`, `es`, `tr`) carry the same key shape.

## Gotchas

* `invalid-image-size` exists under both `input` and `scale` — the full `error.<kind>.<code>` key disambiguates them.
* Gap: no additional codes were found in code beyond the ten listed; if a new error class is added, this table must gain a row.

## References

* `src/core/models/errors/InputError.ts` — the five input codes
* `src/core/models/errors/FileError.ts` — the file code
* `src/core/models/errors/ScaleError.ts` — the three scale codes
* `src/core/models/errors/UnknownError.ts` — the unknown fallback
* `src/core/config/i18n/en.json` — message strings for all keys
