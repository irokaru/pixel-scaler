---
type: Reference
title: Scale Parameters & Limits
description: Lookup table for scale percent, pixel size, and xBR caps.
tags: [algorithms, parameters, limits]
resource: src/constants/form.ts
sources:
  - resource: src/constants/form.ts
    id: param-constants
  - resource: src/core/algorithm/xBR.ts
    id: xbr-limits
generated:
  by: human:maintainer
  at: 2026-09-07T00:00:00Z
status: stable
---

# Scale Parameters & Limits

## Background

Scale settings are bounded by constants so the UI, validation, and the xBR pass decomposition agree on what is allowed.

## Catalog

| Parameter | Min | Max | Default | Lives |
|---|---|---|---|---|
| Scale percent (`ScaleSizePercent`) | 100 | 10000 | 200 | `src/constants/form.ts` |
| Original pixel size (`OriginalPixelSize`) | 1 | 100 | 1 | `src/constants/form.ts` |
| Single xBR pass cap (`XbrMaxPercent`) | — | 400 | — | `src/core/algorithm/xBR.ts` |

* Requests above 400% are split into multiple xBR passes by `calcScalePercents`; percents below 200 normalize to a 2x pass (`normalizeScalePercent`).
* `validateImageSize` requires `width % originalPixelSize == 0` and `height % originalPixelSize == 0`, else a `ScaleError("invalid-image-size")` is thrown.

## Gotchas

* The Pixel field is 1 for original-size art; for already-enlarged art enter the enlargement factor so the divisibility rule holds.

## References

* `src/constants/form.ts` — `ScaleSizePercent`, `OriginalPixelSize`, `ScaleMode`
* `src/core/algorithm/xBR.ts` — `XbrMaxPercent`, `calcScalePercents`, `validateImageSize`
