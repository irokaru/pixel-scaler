import { readFileSync } from "node:fs";
import path from "node:path";

export const Png1px = readFileSync(
  path.resolve(import.meta.dirname, "./1px.png"),
);
export const Png1pxAlpha = readFileSync(
  path.resolve(import.meta.dirname, "./1px_alpha.png"),
);
export const Jpg1px = readFileSync(
  path.resolve(import.meta.dirname, "./1px.jpg"),
);
export const Jpg1pxAlpha = readFileSync(
  path.resolve(import.meta.dirname, "./1px_alpha.jpg"),
);

export const Png2px = readFileSync(
  path.resolve(import.meta.dirname, "./2px.png"),
);
export const Png2pxAlpha = readFileSync(
  path.resolve(import.meta.dirname, "./2px_alpha.png"),
);
export const Jpg2px = readFileSync(
  path.resolve(import.meta.dirname, "./2px.jpg"),
);
export const Jpg2pxAlpha = readFileSync(
  path.resolve(import.meta.dirname, "./2px_alpha.jpg"),
);
