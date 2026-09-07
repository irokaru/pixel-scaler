---
type: Concept
title: Error Handling Model
description: Error kinds, propagation flow, and recoverable versus fatal semantics.
tags: [lifecycle, errors, model]
resource: src/core/models/errors/_ErrorBase.ts
sources:
  - resource: src/core/models/errors/_ErrorBase.ts
    id: error-base
  - resource: src/stores/errorStore.ts
    id: error-store
  - resource: src/stores/convertStore.ts
    id: convert-errors
generated:
  by: human:maintainer
  at: 2026-09-07T00:00:00Z
status: stable
---

# Error Handling Model

## Background

All domain failures are typed errors built on `CustomErrorBase`, which assigns each error a uuid and serializes it via `toObject()` to the `error.<kind>.<code>` key shape with params. There are four kinds: `InputError`, `FileError`, `ScaleError`, and `UnknownError` (`src/core/models/errors/`).

## Guidance

* **Flow:** a Service throws → a Store catches and either records it on the entry or forwards it to the global `errorStore` → a Component displays it (`src/stores/errorStore.ts`).
* **Entry-scoped (recoverable):** `ScaleError` during conversion is stored on the entry's own error list, so other entries are unaffected and the entry can be retried after fixing settings (`clearEntryErrors` resets it).
* **Global (recoverable):** anything else becomes a global error entry, dismissable one by one (`deleteOneError`) or all at once (`clearErrors`); non-domain exceptions are wrapped as `UnknownError`.
* **Fatal (unexpected):** `UnknownError` carries only a raw message for reporting to the developer; it signals a bug rather than a user-fixable condition.
* User-facing messages always come from i18n keys, never hardcoded strings.

## Gotchas

* Because entry-scoped and global errors live in different places, the UI must check both the entry error list and the global store to show every failure.

## References

* `src/core/models/errors/` — `CustomErrorBase` and the four error kinds
* `src/stores/errorStore.ts` — global error state (`addError`, `clearErrors`, `deleteOneError`)
* `src/stores/convertStore.ts` — entry-scoped versus global error routing
* `src/components/InputErrorList.vue` — error display
* [Error Code → i18n Key Catalog](error-code-catalog.md) — every code and its message key
