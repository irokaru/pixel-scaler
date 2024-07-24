import JSZip from "jszip";

export const filesToZip = async (files: File[]): Promise<Blob> => {
  const zip = new JSZip();

  files.map((file) => zip.file(file.name, file));

  return new Promise((resolve, reject) => {
    zip
      .generateAsync({ type: "blob" })
      .then((blob) => {
        resolve(blob);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};
