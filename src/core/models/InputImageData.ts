import { v4 as uuidv4 } from "uuid";

import { encodeAsGif } from "@/core/utils/gif";
import { PSImageDataObject, PSImageDataSettingType } from "@/types/convert";
import { CustomErrorObject } from "@/types/error";
import { ScaleModeType } from "@/types/form";

import { InputError } from "./errors/InputError";

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
  public imageData!: ImageData | null;
  public width!: number;
  public height!: number;
  public originalPixelSize!: number;
  public errors: CustomErrorObject<"scale">[] = [];
  private _url?: string;

  protected constructor(data: File) {
    this.data = data;
  }

  public static async init(data: File): Promise<PSImageData> {
    const inputImageData = new PSImageData(data);

    await inputImageData.loadImageData();

    inputImageData.uuid = uuidv4();
    inputImageData.width = inputImageData.imageData.width;
    inputImageData.height = inputImageData.imageData.height;

    if (data.type === "image/gif") {
      inputImageData._url = await inputImageData.readFileAsDataUrl();
    }

    inputImageData.validate();

    return inputImageData;
  }

  public static async fromImageData(
    imageData: ImageData,
    source: PSImageDataObject,
  ): Promise<PSImageData> {
    const instance = new PSImageData(source.data);
    instance.uuid = uuidv4();
    instance.imageData = imageData;
    instance.width = imageData.width;
    instance.height = imageData.height;
    instance.originalPixelSize = source.originalPixelSize;

    if (source.data.type === "image/gif") {
      const gifFile = encodeAsGif(imageData, source.data.name);
      instance._url = await instance.readFileAsDataUrl(gifFile);
    }

    return instance;
  }

  public toUrl(): string {
    // NOTE: imageData is nulled out after scaling to free memory.
    // In that case, _url must have been set at init time (GIF) or by a prior toUrl() call.
    if (this.imageData === null) {
      if (this._url === undefined) {
        throw new InputError("canvas-is-unsupported", {
          filename: this.data.name,
        });
      }
      return this._url;
    }

    if (this._url !== undefined) {
      return this._url;
    }

    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new InputError("canvas-is-unsupported", {
        filename: this.data.name,
      });
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

    try {
      await img.decode();
    } catch {
      throw new InputError("encoding-error", {
        filename: this.data.name,
      });
    }

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new InputError("canvas-is-unsupported", {
        filename: this.data.name,
      });
    }

    ctx.drawImage(img, 0, 0);
    this.imageData = ctx.getImageData(0, 0, img.width, img.height);
  }

  protected async readFileAsDataUrl(file?: File): Promise<string> {
    const targetFile = file ?? this.data;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result as string));
      reader.addEventListener("error", () => reject(reader.error));
      reader.readAsDataURL(targetFile);
    });
  }

  protected validate() {
    if (!this.data.type.startsWith("image/")) {
      throw new InputError("invalid-image-type", {
        filename: this.data.name,
      });
    }

    try {
      fetch(this.toUrl());
    } catch {
      throw new InputError("file-not-found", { filename: this.data.name });
    }
  }
}
