# AGENTS.md

Pixel Scaler — A client-side pixel art upscaling PWA/Tauri app using xBR and Nearest Neighbor algorithms. All processing runs offline for user privacy.

## Tech Stack

Vue 3 (Composition API) / TypeScript (strict) / Vite / Pinia / Vitest / Tauri

## Commands

- `bun install` — Install dependencies
- `bun run dev` — Start dev server
- `bun run test` — Run unit tests
- `bun run build` — Production build

## Architecture (Mandatory Rules)

Dependency direction: **Component → Composable → Store → Service**

- Services (`src/core/services/`) are pure TypeScript. They **MUST NOT** depend on Vue or Pinia.
- Stores (`src/stores/`) use services for state management but contain no complex business logic.
- Composables (`src/composables/`) use stores and provide Vue-specific reactivity.
- Components (`src/components/`) use composables/stores only — no direct service calls.
- Circular dependencies are strictly prohibited.

## Key Conventions (Apply to Every Task)

- All UI text must go through `vue-i18n` translation keys (defined in `src/core/config/i18n/`). Never hardcode user-facing strings.
- Use `<style lang="scss" scoped>` with CSS variables (`var(--color-text-primary)`) for theming. No hardcoded hex colors.
- Use `@/*` path aliases for all internal imports. Avoid relative paths like `../../`.
- When modifying logic, you **must** add or update corresponding tests. Tests in `tests/unit/` mirror the `src/` structure.
- Commit messages: concise one-liner in English. Linting/formatting runs automatically via lint-staged/husky.

## Detailed Guidelines

- Architecture & directory details: see `docs/ARCHITECTURE.md`
- Coding conventions & patterns: see `docs/CONVENTIONS.md`
