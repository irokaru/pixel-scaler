import { v4 as uuidv4 } from "uuid";

import { PSImageDataObject, PSImageDataSettingType } from "@/@types/convert";
import { CustomErrorObject } from "@/@types/error";
import { ScaleModeType } from "@/@types/form";

export class PSImageDataSetting implements PSImageDataSettingType {
  public scaleSizePercent!: number;
  public scaleMode!: ScaleModeType;

  public constructor(settings: PSImageDataSettingType) {
    this.scaleSizePercent = settings.scaleSizePercent;
    this.scaleMode = settings.scaleMode;
  }
}

export class PSImageData {
  public uuid: string = "mock-uuid";
  public readonly data: File;
  public imageData: ImageData = new ImageData(1, 1);
  public width: number = 1;
  public height: number = 1;
  public originalPixelSize: number = 1;
  public errors: CustomErrorObject<"scale">[] = [];

  protected constructor(data: File) {
    this.data = data;
  }

  public static async init(data: File): Promise<PSImageData> {
    const inputImageData = new PSImageData(data);
    inputImageData.uuid = uuidv4();
    return inputImageData;
  }

  public toUrl(): string {
    return `data:image/png;base64,mock-image-url-${this.data.name}`;
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
    return;
  }
}

export default PSImageData;
