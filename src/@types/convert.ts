import { InputImageData } from "@/models/InputImageData";

export type ConvertedFile = {
  file: InputImageData;
  scaledSizePercent: number;
  scaledType: string;
};

export type ConvertError = {
  filename: string;
  message: string;
};
