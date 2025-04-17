import { zipSync } from "fflate";

import { ScaledImage } from "@/@types/convert";

export const downloadString = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  downloadString(url, fileName);
  URL.revokeObjectURL(url);
};

export const createZipBlobFromScaledImages = async (images: ScaledImage[]) => {
  const zipEntries: Record<string, Uint8Array> = {};

  for (const image of images) {
    const blob = image.image.data;
    const buffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    const fileName = image.image.data.name;
    const filePath = `${image.scaledType}/x${image.scaledSizePercent}/${fileName}`;
    zipEntries[filePath] = uint8Array;
  }

  const zipped = zipSync(zipEntries);
  return new Blob([zipped], { type: "application/zip" });
};
