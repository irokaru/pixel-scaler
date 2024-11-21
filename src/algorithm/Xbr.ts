import { InputImageData } from "@/models/InputImageData";

export const xbr = (
  file: InputImageData,
  width: number,
  height: number,
): Promise<InputImageData> => {
  throw new Error("should not be called");
  return Promise.resolve(file);
};
