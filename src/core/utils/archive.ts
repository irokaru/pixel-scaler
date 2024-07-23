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
