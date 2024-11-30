export class InputImageData {
  public readonly data: File;
  public imageData!: ImageData;
  public width!: number;
  public height!: number;
  public originalPixelSize!: number;

  protected constructor(data: File) {
    this.data = data;
  }

  public static async init(data: File): Promise<InputImageData> {
    const inputImageData = new this(data);

    await inputImageData.loadImageData();

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
