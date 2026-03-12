import { describe, test, expect, afterEach } from "vitest";

import { ScaleMode } from "@/constants/form";
import { InputError } from "@/core/models/errors/InputError";
import { PSImageData, PSImageDataSetting } from "@/core/models/InputImageData";

import {
  create1pxGifFile,
  create1pxPngFile,
  create2pxPngFile,
} from "../../../utils/imageTestHelper";

describe("PSImageDataSetting", () => {
  test("should create setting with provided values", () => {
    const settings = {
      scaleSizePercent: 200,
      scaleMode: ScaleMode.Nearest,
    };

    const setting = new PSImageDataSetting(settings);

    expect(setting.scaleSizePercent).toBe(200);
    expect(setting.scaleMode).toBe(ScaleMode.Nearest);
  });
});

describe("PSImageData", () => {
  let revokeUrls: string[] = [];

  afterEach(() => {
    for (const url of revokeUrls) {
      URL.revokeObjectURL(url);
    }
    revokeUrls = [];
  });

  describe("init", () => {
    test("should successfully create PSImageData from 1px PNG", async () => {
      const file = create1pxPngFile();

      const imageData = await PSImageData.init(file);

      expect(imageData).toBeInstanceOf(PSImageData);
      expect(imageData.uuid).toBeDefined();
      expect(imageData.uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
      expect(imageData.data).toBe(file);
      expect(imageData.width).toBe(1);
      expect(imageData.height).toBe(1);
      expect(imageData.imageData).toBeInstanceOf(ImageData);
      expect(imageData.errors).toEqual([]);
    });

    test("should successfully create PSImageData from 2px PNG", async () => {
      const file = create2pxPngFile();

      const imageData = await PSImageData.init(file);

      expect(imageData).toBeInstanceOf(PSImageData);
      expect(imageData.width).toBe(2);
      expect(imageData.height).toBe(2);
      expect(imageData.data.type).toBe("image/png");
    });

    test("should throw error for invalid file type", async () => {
      const invalidFile = new File(["text content"], "test.txt", {
        type: "text/plain",
      });

      await expect(PSImageData.init(invalidFile)).rejects.toThrowError(
        InputError,
      );
      await expect(PSImageData.init(invalidFile)).rejects.toThrowError(
        "encoding-error",
      );
    });

    test("should throw error for corrupted image data", async () => {
      const corruptedData = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
      ]);
      const corruptedFile = new File([corruptedData], "corrupt.png", {
        type: "image/png",
      });

      await expect(PSImageData.init(corruptedFile)).rejects.toThrowError(
        InputError,
      );
      await expect(PSImageData.init(corruptedFile)).rejects.toThrowError(
        "encoding-error",
      );
    });
  });

  describe("toUrl", () => {
    test("should generate valid data URL for PNG", async () => {
      const file = create1pxPngFile();
      const imageData = await PSImageData.init(file);

      const url = imageData.toUrl();

      expect(url).toMatch(/^data:image\/png;base64,/);
      expect(url.length).toBeGreaterThan(22);

      const img = new Image();
      img.src = url;
      await img.decode();

      revokeUrls.push(url);
    });

    test("should generate valid data URL for GIF", async () => {
      const file = create1pxGifFile();
      const imageData = await PSImageData.init(file);
      const url = imageData.toUrl();

      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.addEventListener("error", () =>
          reject(new Error("GIF failed to render")),
        );
        img.src = url;
        img.decode().then(resolve, reject);
      });

      expect(url).toMatch(/^data:image\/gif;base64,/);
    });
  });

  describe("toObject", () => {
    test("should return complete PSImageDataObject", async () => {
      const file = create1pxPngFile();
      const imageData = await PSImageData.init(file);

      const obj = imageData.toObject();

      expect(obj).toMatchObject({
        uuid: expect.any(String),
        data: file,
        imageData: expect.any(ImageData),
        width: 1,
        height: 1,
        url: expect.stringMatching(/^data:image\/png;base64,/),
        status: "loaded",
      });
    });
  });
});
