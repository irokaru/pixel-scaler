---
type: Guide
title: Entry & Convert Lifecycle
description: How an image flows from file input through scaling to download or ZIP.
tags: [lifecycle, entry, convert, download]
resource: src/core/services/image/convertService.ts
sources:
  - resource: src/core/services/image/entryService.ts
    id: entry-service
  - resource: src/core/services/image/convertService.ts
    id: convert-service
  - resource: src/stores/inputImageStore.ts
    id: input-store
  - resource: src/stores/convertStore.ts
    id: convert-store
generated:
  by: human:maintainer
  at: 2026-09-07T00:00:00Z
status: stable
---

# Entry & Convert Lifecycle

## Background

Each selected file becomes an image entry carrying the image data plus its scale settings. Entries move through three stages: input (added), scaled (converted), and output (downloaded or zipped).

## Workflow

1. **Input** — `addEntryFromFile` rejects a file whose name already exists (`FileError("duplicate-image")`), then `createImageEntry` builds the entry (`src/core/services/image/entryService.ts`, `src/stores/inputImageStore.ts`).
2. **Convert** — `convertOne` / `convertAnyChecked` skip entries already converted with identical settings (`isDuplicateEntry`: same file name, scale percent, original pixel size, and scale mode): `buildScaledEntry` records a `ScaleError("duplicate-image-and-settings")` on the entry's error list and omits the scaled result. Otherwise `convertImage` dispatches to xBR or Nearest Neighbor, marks the result `scaled`, and discards raw pixel data to free memory.
3. **Output** — converted entries are downloaded individually or packed into `images.zip` (`downloadString`, `downloadBlob`, `createZipBlobFromScaledImages`); a Tauri output directory can be chosen via the output path store.

## Gotchas

* Duplicate detection compares name plus settings, not file contents — a different file with the same name still counts as a duplicate.
* Batch conversion runs entries in parallel and preserves input order in the results.

## References

* `src/core/services/image/entryService.ts` — entry creation and file-name check
* `src/core/services/image/convertService.ts` — `convertImage`, `isDuplicateEntry`, GIF loop
* `src/stores/inputImageStore.ts` — input entries, download and ZIP actions
* `src/stores/convertStore.ts` — convert actions and duplicate-settings guard
* `src/stores/scaledImageStore.ts` — converted entry storage
