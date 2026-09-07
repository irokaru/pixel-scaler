---
type: Guide
title: Pixel Scaling Algorithms
description: How to choose between xBR Smooth, Nearest Neighbor, and animated GIF scaling.
tags: [algorithms, xbr, nearest-neighbor, gif]
resource: src/core/algorithm/xBR.ts
sources:
  - resource: src/core/algorithm/xBR.ts
    id: xbr-impl
  - resource: src/core/algorithm/Nearestneighbor.ts
    id: nearest-impl
  - resource: src/core/services/image/convertService.ts
    id: convert-dispatch
  - resource: src/core/utils/gif.ts
    id: gif-utils
generated:
  by: human:maintainer
  at: 2026-09-07T00:00:00Z
status: stable
---

# Pixel Scaling Algorithms

## Background

The app offers two scale modes, dispatched by scale setting (`src/core/services/image/convertService.ts#getScaleMethod`): Smooth mode runs the xBR algorithm, Nearest mode runs Nearest Neighbor. Animated GIFs are scaled frame by frame through the same dispatch and re-encoded with original frame delays preserved.

## Trade-offs

* **Smooth (xBR)** — best for pixel art that should look like a smooth illustration. It wraps `xbr-js` (`xbr2x`/`3x`/`4x`), first downscales the image to its original pixel size, decomposes the requested percent into 2x/3x/4x passes (`XbrMaxPercent = 400`, recursive `calcScalePercents`), then resizes to the exact target size.
* **Nearest Neighbor** — best for crisp, blocky pixels. It resizes on canvas with smoothing disabled (`src/core/algorithm/Nearestneighbor.ts`) and rounds target dimensions to whole pixels.
* **Animated GIF** — each frame is scaled with the selected mode and re-encoded with its delay kept (`convertAnimatedGif`). An image with no frames fails with an `encoding-error`.
* The in-app tips recommend converting original-size pixel art (not pre-enlarged art) and note that non-pixel-art illustrations do not upscale cleanly.

## Gotchas

* xBR input dimensions must be multiples of the original pixel size, otherwise conversion throws (`invalid-image-size`); set the Pixel field to match already-enlarged art.
* Setting scale to 100% in Smooth mode still applies anti-aliasing rather than returning identical pixels.
* Gap: no frame-count or resolution cap for animated GIFs was found in code, so large GIFs may be slow or memory-heavy with no documented limit.

## References

* `src/core/algorithm/xBR.ts` — xBR passes, 400% cap, size validation
* `src/core/algorithm/Nearestneighbor.ts` — smoothing-disabled resize
* `src/core/services/image/convertService.ts` — mode dispatch and GIF loop
* `src/core/utils/gif.ts` — GIF encode/decode helpers
* `src/core/utils/imageUtils.ts` — shared canvas resize helper
