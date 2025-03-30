import type { ScaleModeType } from "./form";

export type InputImageDataSettingType = {
  scaleSizePercent: number;
  scaleMode: ScaleModeType;
  checked: boolean;
};

export type InputImageDataObject = {
  uuid: string;
  data: File;
  imageData: ImageData;
  width: number;
  height: number;
  originalPixelSize: number;
  url: string;
};

export type ImageEntry = {
  image: InputImageDataObject;
  settings: InputImageDataSettingType;
};

export type ConvertedFile = {
  file: InputImageDataObject;
  scaledSizePercent: number;
  scaledType: ScaleModeType;
};

export type ConvertError = {
  filename: string;
  message: string;
};
