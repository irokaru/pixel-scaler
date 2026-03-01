# Coding Conventions

## TypeScript

- Strict mode is enabled. All code must pass strict type checking.
- Avoid `any`. Use proper types or `unknown` when the type is truly unknown.
- Use `@/*` path aliases for all internal imports (e.g., `@/core/services/fooService`). Avoid relative paths like `../../`.
- JSDoc is **not required**. Code should be self-documenting through clear naming.

## Vue Components

- Use `<script setup lang="ts">` for all components.
- Keep component logic minimal; delegate to composables or stores.

## Internationalization (i18n)

- UI text must **never** be hardcoded in components.
- Add translation keys to `src/core/config/i18n/en.json` (and `ja.json` when possible).
- Use `t('key.path')` in templates and scripts via `vue-i18n`.

## Styling

- Use `<style lang="scss" scoped>`.
- Use CSS variables for all colors (e.g., `var(--color-text-primary)`) to support dark/light themes.
- Do not hardcode hex colors in components.

## Testing

- When modifying logic, you **must** add or update corresponding tests.
- Prefer data-driven tests with `test.each` for efficient multi-scenario coverage.
- Tests live in `tests/unit/` and mirror the `src/` directory structure.
- Run tests: `npm run test`

## Comments

- `// NOTE: ...` — Explain intentional but non-obvious implementations or historical decisions.
- `// TODO: ...` — Mark items for future consideration or implementation.

## Git Workflow

1. Identify which layer (Service / Store / Composable / Component) needs changes.
2. Implement following the architecture rules in `docs/ARCHITECTURE.md`.
3. Run `npm run test` to verify correctness.
4. Commit — lint-staged and husky handle formatting automatically.
5. Commit message: concise one-liner in English.
