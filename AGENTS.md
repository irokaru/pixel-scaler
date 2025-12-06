# AGENTS.md

This document provides context, guidelines, and rules for AI agents working on the **Pixel Scaler** repository.

## 1. Project Overview

**Pixel Scaler** is a pixel art scaling application designed for privacy and high-quality output.
*   **Core Functionality**: Upscaling pixel art using algorithms like xBR and Nearest Neighbor.
*   **Platform**: Primarily a **PWA (Progressive Web App)**, but also buildable as a standalone application using **Tauri**.
*   **Key Value**: All processing is done client-side (offline-first), ensuring user data privacy.

## 2. Technology Stack

*   **Framework**: Vue 3 (Composition API, `<script setup>`)
*   **Language**: TypeScript (Strict mode)
*   **Build Tool**: Vite
*   **State Management**: Pinia
*   **Testing**: Vitest
*   **Desktop Wrapper**: Tauri

## 3. Development Environment Setup

*   **Node.js**: >= 22.0.0 (specified in `package.json`)
*   **Package Manager**: npm
*   **Initial Setup**:
    ```sh
    npm ci
    ```
*   **Development Server**:
    ```sh
    npm run dev          # Start Vite dev server (PWA mode)
    npm run dev:tauri    # Start Tauri dev server (Desktop app mode)
    ```
*   **Other Useful Commands**:
    *   `npm run test` - Run unit tests
    *   `npm run test:watch` - Run tests in watch mode
    *   `npm run test:coverage` - Run tests with coverage report
    *   `npm run test:e2e` - Run E2E tests with Playwright
    *   `npm run build` - Build for production (PWA)
    *   `npm run build:tauri` - Build Tauri desktop app
    *   `npm run preview` - Preview production build

## 4. Architecture & Directory Structure

The project follows a strict separation of concerns:

*   **`src/core/services`**:
    *   Contains pure TypeScript business logic.
    *   **MUST NOT** depend on Vue or Pinia.
    *   Handles algorithms, data transformation, and storage interactions.
    *   Examples: `colorService.ts`, `i18nService.ts`, `versionService.ts`
    *   Image-related services: `image/convertService.ts`, `image/entryBatchService.ts`, `image/entryService.ts`
*   **`src/stores`**:
    *   Pinia stores for global state management.
    *   Connects UI components with services.
    *   Naming convention: `use[Name]Store` (e.g., `useConvertStore`, `useInputImageStore`, `useScaledImageStore`, `useErrorStore`, `useOutputPathStore`)
*   **`src/composables`**:
    *   Vue-specific logic (Reactivity, Lifecycle hooks, DOM interaction).
    *   Should delegate heavy business logic to services.
    *   Naming convention: `use[Feature]` (e.g., `useFormFileInput`, `useGlobalError`, `useI18n`, `useImageCheckable`)
*   **`src/components`**:
    *   Presentational components.
    *   Keep logic minimal; delegate to composables or stores.
    *   Organized by feature: `common/`, `convert/`, `settings/`
*   **`src/@types`**:
    *   Common type definitions shared across the application.
    *   Examples: `convert.ts`, `error.ts`, `form.ts`, `link.ts`
*   **`src/models`**:
    *   Domain model classes (e.g., error classes).
    *   Example: `errors/ScaleError.ts`
*   **`src/algorithm`**:
    *   Pixel scaling algorithm implementations.
*   **`src/constants`**:
    *   Application-wide constants.
*   **`tests/unit`**:
    *   Mirrors the `src` directory structure.
    *   Helpers are located in `tests/utils`.

### Dependency Rules

*   **Direction**: Component → Composable → Store → Service
*   **Services** are framework-agnostic and must not import from Vue, Pinia, or any UI layer.
*   **Stores** can use services but should not contain complex business logic.
*   **Composables** can use stores and provide Vue-specific reactivity.
*   **Components** should primarily use composables and stores, avoiding direct service calls.
*   **Circular dependencies** are strictly prohibited.

## 5. Coding Rules & Conventions

### General
*   **Linting**: Strictly follow **ESLint** rules. Ensure no linting errors are introduced.
*   **JSDoc**: **NOT REQUIRED**. Code should be self-documenting. Use clear variable and function names.

### Internationalization (i18n)
*   **No Hardcoding**: UI text must **NEVER** be hardcoded in components.
*   **Usage**: Use `vue-i18n`.
    *   Add translation keys to `src/core/config/i18n/en.json` (and `ja.json` if possible).
    *   Use `t('key.path')` in templates or scripts.

### Styling (CSS/SCSS)
*   **Format**: Use `<style lang="scss" scoped>`.
*   **Theming**: Use CSS variables (e.g., `var(--color-text-primary)`) for colors to support themes (Dark/Light mode).
    *   Do not hardcode hex colors (e.g., `#000000`) in components unless absolutely necessary for a specific non-themeable element.

### Testing
*   **Mandatory Updates**: When modifying logic, you **MUST** update or add corresponding tests.
*   **Test Structure**:
    *   Prefer data-driven tests using `test.each` to cover multiple scenarios efficiently.
    *   Ensure tests are easy to extend by simply adding new cases to the data set.
*   **Command**: Run `npm run test` to execute unit tests.

### Comments
*   **NOTE**: Use `// NOTE: ...` to explain special implementations, historical context, or decisions that might look unusual but are intentional.
*   **TODO**: Use `// TODO: ...` for items that need future consideration or implementation.

### Vue & TypeScript
*   Use `<script setup lang="ts">` for components.
*   Avoid `any`. Use proper typing.
*   TypeScript strict mode is enabled in `tsconfig.json`.

### TypeScript & Type Definitions
*   **Strict Mode**: Enabled. All code must pass strict type checking.
*   **Type Definitions**:
    *   Common types: `src/@types/` (e.g., `convert.ts`, `error.ts`, `form.ts`)
    *   Model classes: `src/models/` (e.g., `errors/ScaleError.ts`)
*   **Path Aliases**:
    *   Use `@/*` to reference `src/*` (e.g., `import { foo } from '@/core/services/fooService'`)
    *   Always use path aliases for internal imports; avoid relative paths like `../../`
*   **Avoid `any`**: Use proper types or `unknown` if the type is truly unknown.

### Error Handling
*   **Custom Error Classes**: Define domain-specific errors in `src/models/errors/` (e.g., `ScaleError`, `InputError`)
*   **Error Store**: Use `useErrorStore` for global error management
*   **Error Flow**:
    *   Services throw errors (custom error classes or standard errors)
    *   Stores catch errors and either handle them or pass to error store
    *   Components display errors from stores
*   **User-Facing Errors**: All error messages must use i18n keys, not hardcoded strings

## 6. Build & Deployment

*   **PWA Build**: `npm run build` - Builds the Progressive Web App for production
*   **Standalone Build**: `npm run build:standalone` - Builds in standalone mode (different environment variables)
*   **Tauri Build**: `npm run build:tauri` - Builds the desktop application
*   **Preview**: `npm run preview` - Preview the production build locally (requires running `npm run build` first)
*   **Automatic Cleanup**: Build process automatically removes temporary TypeScript build info files

### Browser Support
*   **Target**: Modern browsers with ES6+ support
*   **File System Access API**: Used for enhanced file picking when available; gracefully degrades to standard file input
*   **Canvas API**: Required for image processing
*   **Progressive Web App**: Supports offline functionality and installation

## 7. Workflow & Git

1.  **Understand the Goal**: Read the issue or prompt carefully.
2.  **Plan**: Identify which layer (Service, Store, Composable, Component) needs change.
3.  **Implement**: Write code following the architecture above.
4.  **Test**: 
    *   Run `npm run test` to ensure logic correctness.
    *   Add or update tests for modified functionality.
    *   For browser-specific features, run `npm run test:browser`.
5.  **Verify Build**: Ensure the application builds successfully with `npm run build` (optional but recommended for significant changes).
6.  **Commit**:
    *   Linting and formatting are automatically handled by `lint-staged` and `husky` upon commit.
    *   Message: **Concise one-liner in English**. (e.g., "Refactor image conversion logic to use Pinia store")
