import { CustomErrorObject } from "./error";

import type { ScaleModeType } from "./form";

export type PSImageDataSettingType = {
  scaleSizePercent: number;
  scaleMode: ScaleModeType;
};

export type PSImageDataObject = {
  uuid: string;
  data: File;
  imageData: ImageData;
  width: number;
  height: number;
  originalPixelSize: number;
  url: string;
  status: PSImageStatus;
};

export type PSImageStatus = "loaded" | "scaled";

export type ImageEntry = {
  image: PSImageDataObject;
  settings: PSImageDataSettingType;
  errors: CustomErrorObject<"scale">[];
};

export type ImageCheckList = Record<PSImageDataObject["uuid"], boolean>;
