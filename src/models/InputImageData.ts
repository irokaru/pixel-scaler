import { v4 as uuidv4 } from "uuid";

import { PSImageDataObject, PSImageDataSettingType } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";

export class PSImageDataSetting implements PSImageDataSettingType {
  public scaleSizePercent!: number;
  public scaleMode!: ScaleModeType;

  public constructor(settings: PSImageDataSettingType) {
    this.scaleSizePercent = settings.scaleSizePercent;
    this.scaleMode = settings.scaleMode;
  }
}

/**
 * @example ```ts
 * const imageData = await PSImageData.init(file);
 * // cannot use constructor
 * const imageData = new PSInputImageData(file);
 * ```
 */
export class PSImageData {
  public uuid!: string;
  public readonly data: File;
  public imageData!: ImageData;
  public width!: number;
  public height!: number;
  public originalPixelSize!: number;

  protected constructor(data: File) {
    this.data = data;
  }

  public static async init(data: File): Promise<PSImageData> {
    const inputImageData = new PSImageData(data);

    await inputImageData.loadImageData();

    inputImageData.uuid = uuidv4();
    inputImageData.width = inputImageData.imageData.width;
    inputImageData.height = inputImageData.imageData.height;

    inputImageData.validate();

    return inputImageData;
  }

  public toUrl(): string {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("could not get 2d context");
    }

    ctx.putImageData(this.imageData, 0, 0);

    return canvas.toDataURL(this.data.type);
  }

  public toObject(): PSImageDataObject {
    return {
      uuid: this.uuid,
      data: this.data,
      imageData: this.imageData,
      width: this.width,
      height: this.height,
      originalPixelSize: this.originalPixelSize,
      url: this.toUrl(),
      status: "loaded",
    };
  }

  protected async loadImageData(): Promise<void> {
    const img = new Image();
    img.src = URL.createObjectURL(this.data);

    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("could not get 2d context");
    }

    ctx.drawImage(img, 0, 0);
    this.imageData = ctx.getImageData(0, 0, img.width, img.height);
  }

  protected validate() {
    if (!this.data.type.startsWith("image/")) {
      throw new Error("data is not an image");
    }

    try {
      fetch(this.toUrl());
    } catch {
      throw new Error("data is not a valid image");
    }
  }
}
