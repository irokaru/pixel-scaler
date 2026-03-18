import type { GifFrame } from "@/core/types/gif";

import type { CustomErrorObject } from "./error";
import type { ScaleModeType } from "./form";

export type PSImageDataSettingType = {
  scaleSizePercent: number;
  scaleMode: ScaleModeType;
};

type PSImageDataObjectBase = {
  uuid: string;
  data: File;
  imageData: ImageData | null;
  width: number;
  height: number;
  originalPixelSize: number;
  url: string;
  status: PSImageStatus;
};

export type StaticPSImageDataObject = PSImageDataObjectBase & {
  animated: false;
};

export type AnimatedGifPSImageDataObject = PSImageDataObjectBase & {
  animated: true;
  frames: GifFrame[] | null;
};

export type PSImageDataObject =
  | StaticPSImageDataObject
  | AnimatedGifPSImageDataObject;

export type PSImageStatus = "loaded" | "scaled";

export type ImageEntry = {
  image: PSImageDataObject;
  settings: PSImageDataSettingType;
  errors: CustomErrorObject<"scale">[];
};

export type ImageCheckList = Record<PSImageDataObject["uuid"], boolean>;
