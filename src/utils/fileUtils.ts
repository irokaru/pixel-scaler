import { BaseDirectory, writeFile } from "@tauri-apps/plugin-fs";
import { zipSync } from "fflate";

import { ImageEntry } from "@/@types/convert";
import { isWeb } from "@/core/system";

import { revokeObjectURL } from "./imageUtils";

export const downloadString = async (url: string, fileName: string) => {
  if (isWeb()) {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
  } else {
    const base64 = url.split(",")[1];
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.codePointAt(i) as number;
    }
    await writeFile(fileName, bytes, { baseDir: BaseDirectory.Home });
  }
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  downloadString(url, fileName);
  revokeObjectURL(url);
};

export const createZipBlobFromScaledImages = async (images: ImageEntry[]) => {
  const zipEntries: Record<string, Uint8Array> = {};

  for (const image of images) {
    const blob = image.image.data;
    const buffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    const fileName = image.image.data.name;
    const filePath = `${image.settings.scaleMode}/org_${image.image.originalPixelSize}px/x${image.settings.scaleSizePercent}/${fileName}`;
    zipEntries[filePath] = uint8Array;
  }

  const zipped = zipSync(zipEntries);
  return new Blob([new Uint8Array(zipped)], { type: "application/zip" });
};
