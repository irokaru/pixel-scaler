---
type: Concept
title: Project Architecture
description: Layer model, dependency direction, core boundary, and key directories.
tags: [project, architecture, layers]
resource: src/core/services/image/convertService.ts
sources:
  - resource: src/core/services/image/convertService.ts
    id: service-example
  - resource: src/stores/convertStore.ts
    id: store-example
  - resource: AGENTS.md
    id: agent-rules
generated:
  by: human:maintainer
  at: 2026-09-07T00:00:00Z
status: stable
---

# Project Architecture

## Background

The codebase is organized in four layers with a strict dependency direction. Pure business logic lives in `src/core/` (framework-free), while Vue and Pinia live only in the outer layers.

| Layer | Location | Responsibility |
|---|---|---|
| Service | `src/core/services/` | Pure TypeScript business logic. Must not depend on Vue or Pinia. |
| Store | `src/stores/` | Pinia global state management. Naming: `use[Name]Store` |
| Composable | `src/composables/` | Vue-specific reactivity and lifecycle. Naming: `use[Feature]` |
| Component | `src/components/` | Presentation only. Minimal logic; delegate to composables/stores. |

Dependency direction (each layer may only depend on layers to its right; circular dependencies are prohibited):

```
Component → Composable → Store → Service
```

> `src/core/` boundary rule: no Vue, no Pinia. DOM and Tauri APIs are allowed.

## Guidance

* Keep complex logic in services so it stays testable without Vue; stores hold state and delegate.
* Use `@/*` path aliases for internal imports instead of relative paths.
* Key directories: `src/core/models/` (domain models, error classes in `errors/`), `src/core/algorithm/` (xBR, Nearest Neighbor), `src/core/guards/` (type guards and validation), `src/core/config/` (i18n JSON, color themes and registries), `src/core/infrastructure/` (storage, environment, browser wrappers), `src/core/utils/` (DOM/Canvas/file helpers), `src/constants/` (app-wide constants), `src/plugins/` (Vue plugins), `src/types/` and `src/core/types/` (shared vs core-only types), `tests/unit/` (tests mirroring `src/`).

## Gotchas

* Gap: no automated cycle-detection setup was found in code, so the no-cycles rule is enforced by review discipline.

## References

* `AGENTS.md` — agent-facing summary of the same rules
* `src/core/services/` — service examples (`image/convertService.ts`, `colorService.ts`)
* `src/stores/` — store examples (`convertStore.ts`, `errorStore.ts`)
* [Engineering Conventions](conventions.md) — code-level rules per layer
* [Error Handling Model](../lifecycle/error-model.md) — Service-throw → Store-catch → Component-display flow
* [Build Targets & Environment Matrix](../contributing/build-targets.md) — build command matrix
