---
okf_version: "0.2"
---

# PiXel ScaLer Knowledge Bundle

* [Pixel Scaling Algorithms](algorithms/scaling-guide.md) - xBR vs Nearest vs GIF, trade-offs and gotchas
* [Scale Parameters & Limits](algorithms/scale-parameters.md) - ScaleSizePercent / OriginalPixelSize / XbrMaxPercent limits
* [Entry & Convert Lifecycle](lifecycle/entry-convert-lifecycle.md) - input → scaled → download/zip flow
* [Error Handling Model](lifecycle/error-model.md) - error kinds, flow, recoverable vs fatal semantics
* [Error Code → i18n Key Catalog](lifecycle/error-code-catalog.md) - every error code mapped to its i18n key
* [Theme Contribution Playbook](contributing/theme-playbook.md) - how to add a theme
* [i18n Contribution Playbook](contributing/i18n-playbook.md) - how to add a locale
* [Build Targets & Environment Matrix](contributing/build-targets.md) - PWA / Tauri / standalone env matrix
* [Project Architecture](project/architecture.md) - layer model, dependency direction, src/core boundary, key directories
* [Engineering Conventions](project/conventions.md) - TypeScript / Vue / testing / comments / git conventions
