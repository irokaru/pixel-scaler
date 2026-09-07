---
type: Reference
title: Engineering Conventions
description: Lookup for TypeScript, Vue, testing, comment, and git conventions.
tags: [project, conventions, typescript, vue, testing, git]
resource: AGENTS.md
sources:
  - resource: AGENTS.md
    id: agent-rules
  - resource: vitest.config.ts
    id: vitest-config
generated:
  by: human:maintainer
  at: 2026-09-07T00:00:00Z
status: stable
---

# Engineering Conventions

## Background

These conventions keep code strict, testable, and consistent across the layer model. See [Project Architecture](architecture.md) for the layers they apply to.

## Catalog

* **TypeScript** — strict mode; avoid `any` (use proper types or `unknown`); prefer `@/*` path aliases over relative imports (styles and fixtures may use relative paths); JSDoc is not required, names should be self-documenting.
* **Vue components** — use `<script setup lang="ts">`; keep logic minimal and delegate to composables or stores; never hardcode UI text (use `t('key.path')` with keys in `src/core/config/i18n/`); style with `<style lang="scss" scoped>`, CSS variables for colors, no hardcoded hex.
* **Testing** — when modifying logic, add or update tests; prefer data-driven `test.each`; tests live in `tests/unit/` mirroring `src/`; run with `bun run test`.
* **Comments** — `// NOTE: ...` for intentional but non-obvious code or historical decisions; `// TODO: ...` for future work.
* **Git workflow** — 1. Identify the affected layer ([Project Architecture](architecture.md)). 2. Implement per the architecture rules. 3. Run `bun run test`. 4. Commit (lint-staged/husky format automatically). 5. One-line English commit message.

## Gotchas

* Gap: no coverage thresholds were found in code, so "enough tests" is a reviewer judgment call.

## References

* `AGENTS.md` — the same conventions in agent-facing form
* `vitest.config.ts` — test runner setup
* `tests/unit/` — examples of mirrored, data-driven tests
* [i18n Contribution Playbook](../contributing/i18n-playbook.md) — translation key workflow
* [Theme Contribution Playbook](../contributing/theme-playbook.md) — styling rules in workflow form
