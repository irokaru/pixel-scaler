# Architecture

## Layer Overview

| Layer | Location | Responsibility |
|---|---|---|
| Service | `src/core/services/` | Pure TypeScript business logic. **Must not** depend on Vue or Pinia. |
| Store | `src/stores/` | Pinia global state management. Naming: `use[Name]Store` |
| Composable | `src/composables/` | Vue-specific reactivity & lifecycle. Naming: `use[Feature]` |
| Component | `src/components/` | Presentation only. Minimal logic; delegate to composables/stores. |

### Dependency Direction

```
Component → Composable → Store → Service
```

Each layer may only depend on the layers to its right. Circular dependencies are strictly prohibited.

## Key Directories

| Location | Purpose |
|---|---|
| `src/@types/` | Shared type definitions across the app |
| `src/models/` | Domain models (e.g., custom error classes in `errors/`) |
| `src/algorithm/` | Pixel scaling algorithm implementations (xBR, Nearest Neighbor) |
| `src/constants/` | Application-wide constants |
| `src/core/config/` | Configuration files (i18n JSON, color themes) |
| `src/core/infrastructure/` | Storage adapters and external interfaces |
| `src/guards/` | Type guards and validation functions |
| `tests/unit/` | Unit tests mirroring `src/` structure |
| `tests/utils/` | Shared test helpers |

## Error Handling

**Flow**: Service (throw) → Store (catch & handle or forward to `errorStore`) → Component (display)

- Custom error classes live in `src/models/errors/`.
- User-facing error messages must use i18n keys, never hardcoded strings.
- Use `useErrorStore` for global error state.

## Build Targets

| Command | Output |
|---|---|
| `npm run build` | PWA production build |
| `npm run build:standalone` | Standalone mode (different env vars) |
| `npm run build:tauri` | Tauri desktop application |
| `npm run preview` | Preview production build locally |
