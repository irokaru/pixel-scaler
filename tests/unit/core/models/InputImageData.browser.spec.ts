import { describe, test, expect, vi } from "vitest";

import { InputError } from "@/core/models/errors/InputError";
import {
  createPSImageData,
  createPSImageDataFromImageData,
} from "@/core/models/InputImageData";

import {
  create1pxGifFile,
  create1pxPngFile,
  create2pxPngFile,
  createAnimatedGifFile,
} from "../../../utils/imageTestHelper";

describe("createPSImageData", () => {
  test("should successfully create PSImageDataObject from 1px PNG", async () => {
    const file = create1pxPngFile();

    const obj = await createPSImageData(file);

    expect(obj.uuid).toBeDefined();
    expect(obj.uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(obj.data).toBe(file);
    expect(obj.width).toBe(1);
    expect(obj.height).toBe(1);
    expect(obj.imageData).toBeInstanceOf(ImageData);
    expect(obj.status).toBe("loaded");
  });

  test("should successfully create PSImageDataObject from 2px PNG", async () => {
    const file = create2pxPngFile();

    const obj = await createPSImageData(file);

    expect(obj.width).toBe(2);
    expect(obj.height).toBe(2);
    expect(obj.data.type).toBe("image/png");
  });

  test("should return valid data URL for PNG", async () => {
    const file = create1pxPngFile();
    const obj = await createPSImageData(file);

    expect(obj.url).toMatch(/^data:image\/png;base64,/);
    expect(obj.url.length).toBeGreaterThan(22);

    const img = new Image();
    img.src = obj.url;
    await img.decode();
  });

  test("should return valid data URL for GIF", async () => {
    const file = create1pxGifFile();
    const obj = await createPSImageData(file);

    expect(obj.url).toMatch(/^data:image\/gif;base64,/);

    const img = new Image();
    img.src = obj.url;
    await img.decode();
  });

  test("should throw error for invalid file type", async () => {
    const invalidFile = new File(["text content"], "test.txt", {
      type: "text/plain",
    });

    await expect(createPSImageData(invalidFile)).rejects.toThrow(InputError);
    await expect(createPSImageData(invalidFile)).rejects.toThrow(
      "invalid-image-type",
    );
  });

  test("should throw error for corrupted image data", async () => {
    const corruptedData = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    const corruptedFile = new File([corruptedData], "corrupt.png", {
      type: "image/png",
    });

    await expect(createPSImageData(corruptedFile)).rejects.toThrow(InputError);
    await expect(createPSImageData(corruptedFile)).rejects.toThrow(
      "encoding-error",
    );
  });

  test("should revoke blob URL after successful load", async () => {
    const file = create1pxPngFile();
    const revokeSpy = vi.spyOn(URL, "revokeObjectURL");

    await createPSImageData(file);

    expect(revokeSpy).toHaveBeenCalledOnce();
    revokeSpy.mockRestore();
  });

  test("should revoke blob URL when image decode fails", async () => {
    const corruptedData = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    const corruptedFile = new File([corruptedData], "corrupt.png", {
      type: "image/png",
    });
    const revokeSpy = vi.spyOn(URL, "revokeObjectURL");

    await expect(createPSImageData(corruptedFile)).rejects.toThrow(InputError);

    expect(revokeSpy).toHaveBeenCalledOnce();
    revokeSpy.mockRestore();
  });

  test("should return complete PSImageDataObject shape", async () => {
    const file = create1pxPngFile();
    const obj = await createPSImageData(file);

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

  test("static path sets animated: false", async () => {
    const file = create1pxPngFile();
    const obj = await createPSImageData(file);
    expect(obj.animated).toBe(false);
  });

  test("static GIF sets animated: false", async () => {
    const file = create1pxGifFile();
    const obj = await createPSImageData(file);
    expect(obj.animated).toBe(false);
  });

  describe("animated GIF", () => {
    test("returns AnimatedGifPSImageDataObject with animated: true", async () => {
      const file = createAnimatedGifFile();
      const obj = await createPSImageData(file);

      expect(obj.animated).toBe(true);
    });

    test("has frames array with correct count", async () => {
      const file = createAnimatedGifFile();
      const obj = await createPSImageData(file);

      if (!obj.animated) throw new Error("Expected animated");
      expect(obj.frames).not.toBeNull();
      expect(obj.frames!.length).toBe(2);
    });

    test("each frame has ImageData and delay", async () => {
      const file = createAnimatedGifFile();
      const obj = await createPSImageData(file);

      if (!obj.animated) throw new Error("Expected animated");
      for (const frame of obj.frames!) {
        expect(frame.imageData).toBeInstanceOf(ImageData);
        expect(frame.delay).toBeGreaterThan(0);
      }
    });

    test("url is a valid GIF data URL", async () => {
      const file = createAnimatedGifFile();
      const obj = await createPSImageData(file);

      expect(obj.url).toMatch(/^data:image\/gif;base64,/);
    });

    test("width and height match GIF logical screen size", async () => {
      const file = createAnimatedGifFile();
      const obj = await createPSImageData(file);

      expect(obj.width).toBeGreaterThan(0);
      expect(obj.height).toBeGreaterThan(0);
    });
  });
});

describe("createPSImageDataFromImageData", () => {
  const createTestImageData = (width: number, height: number): ImageData => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
  };

  test("should create PSImageDataObject with correct dimensions", async () => {
    const file = create1pxPngFile();
    const source = await createPSImageData(file);
    source.originalPixelSize = 2;
    const testImageData = createTestImageData(4, 6);

    const result = await createPSImageDataFromImageData(testImageData, source);

    expect(result.width).toBe(4);
    expect(result.height).toBe(6);
    expect(result.originalPixelSize).toBe(2);
  });

  test("should generate a new uuid different from source", async () => {
    const file = create1pxPngFile();
    const source = await createPSImageData(file);
    const testImageData = createTestImageData(1, 1);

    const result = await createPSImageDataFromImageData(testImageData, source);

    expect(result.uuid).toBeDefined();
    expect(result.uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(result.uuid).not.toBe(source.uuid);
  });

  test("should generate valid data URL for PNG source", async () => {
    const file = create1pxPngFile();
    const source = await createPSImageData(file);
    const testImageData = createTestImageData(2, 2);

    const result = await createPSImageDataFromImageData(testImageData, source);

    expect(result.url).toMatch(/^data:image\/png;base64,/);
    expect(result.url.length).toBeGreaterThan(22);
  });

  test("should generate valid data URL for GIF source", async () => {
    const file = create1pxGifFile();
    const source = await createPSImageData(file);
    const testImageData = createTestImageData(1, 1);

    const result = await createPSImageDataFromImageData(testImageData, source);

    expect(result.url).toMatch(/^data:image\/gif;base64,/);
    expect(result.url.length).toBeGreaterThan(22);
  });

  test("always sets animated: false on result", async () => {
    const file = create1pxPngFile();
    const source = await createPSImageData(file);
    const testImageData = createTestImageData(1, 1);

    const result = await createPSImageDataFromImageData(testImageData, source);

    expect(result.animated).toBe(false);
  });
});

describe("createPSImageData", () => {
  test("should successfully create PSImageDataObject from 1px PNG", async () => {
    const file = create1pxPngFile();

    const obj = await createPSImageData(file);

    expect(obj.uuid).toBeDefined();
    expect(obj.uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(obj.data).toBe(file);
    expect(obj.width).toBe(1);
    expect(obj.height).toBe(1);
    expect(obj.imageData).toBeInstanceOf(ImageData);
    expect(obj.status).toBe("loaded");
  });

  test("should successfully create PSImageDataObject from 2px PNG", async () => {
    const file = create2pxPngFile();

    const obj = await createPSImageData(file);

    expect(obj.width).toBe(2);
    expect(obj.height).toBe(2);
    expect(obj.data.type).toBe("image/png");
  });

  test("should return valid data URL for PNG", async () => {
    const file = create1pxPngFile();
    const obj = await createPSImageData(file);

    expect(obj.url).toMatch(/^data:image\/png;base64,/);
    expect(obj.url.length).toBeGreaterThan(22);

    const img = new Image();
    img.src = obj.url;
    await img.decode();
  });

  test("should return valid data URL for GIF", async () => {
    const file = create1pxGifFile();
    const obj = await createPSImageData(file);

    expect(obj.url).toMatch(/^data:image\/gif;base64,/);

    const img = new Image();
    img.src = obj.url;
    await img.decode();
  });

  test("should throw error for invalid file type", async () => {
    const invalidFile = new File(["text content"], "test.txt", {
      type: "text/plain",
    });

    await expect(createPSImageData(invalidFile)).rejects.toThrow(InputError);
    await expect(createPSImageData(invalidFile)).rejects.toThrow(
      "invalid-image-type",
    );
  });

  test("should throw error for corrupted image data", async () => {
    const corruptedData = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    const corruptedFile = new File([corruptedData], "corrupt.png", {
      type: "image/png",
    });

    await expect(createPSImageData(corruptedFile)).rejects.toThrow(InputError);
    await expect(createPSImageData(corruptedFile)).rejects.toThrow(
      "encoding-error",
    );
  });

  test("should revoke blob URL after successful load", async () => {
    const file = create1pxPngFile();
    const revokeSpy = vi.spyOn(URL, "revokeObjectURL");

    await createPSImageData(file);

    expect(revokeSpy).toHaveBeenCalledOnce();
    revokeSpy.mockRestore();
  });

  test("should revoke blob URL when image decode fails", async () => {
    const corruptedData = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    const corruptedFile = new File([corruptedData], "corrupt.png", {
      type: "image/png",
    });
    const revokeSpy = vi.spyOn(URL, "revokeObjectURL");

    await expect(createPSImageData(corruptedFile)).rejects.toThrow(InputError);

    expect(revokeSpy).toHaveBeenCalledOnce();
    revokeSpy.mockRestore();
  });

  test("should return complete PSImageDataObject shape", async () => {
    const file = create1pxPngFile();
    const obj = await createPSImageData(file);

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

describe("createPSImageDataFromImageData", () => {
  const createTestImageData = (width: number, height: number): ImageData => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
  };

  test("should create PSImageDataObject with correct dimensions", async () => {
    const file = create1pxPngFile();
    const source = await createPSImageData(file);
    source.originalPixelSize = 2;
    const testImageData = createTestImageData(4, 6);

    const result = await createPSImageDataFromImageData(testImageData, source);

    expect(result.width).toBe(4);
    expect(result.height).toBe(6);
    expect(result.originalPixelSize).toBe(2);
  });

  test("should generate a new uuid different from source", async () => {
    const file = create1pxPngFile();
    const source = await createPSImageData(file);
    const testImageData = createTestImageData(1, 1);

    const result = await createPSImageDataFromImageData(testImageData, source);

    expect(result.uuid).toBeDefined();
    expect(result.uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(result.uuid).not.toBe(source.uuid);
  });

  test("should generate valid data URL for PNG source", async () => {
    const file = create1pxPngFile();
    const source = await createPSImageData(file);
    const testImageData = createTestImageData(2, 2);

    const result = await createPSImageDataFromImageData(testImageData, source);

    expect(result.url).toMatch(/^data:image\/png;base64,/);
    expect(result.url.length).toBeGreaterThan(22);
  });

  test("should generate valid data URL for GIF source", async () => {
    const file = create1pxGifFile();
    const source = await createPSImageData(file);
    const testImageData = createTestImageData(1, 1);

    const result = await createPSImageDataFromImageData(testImageData, source);

    expect(result.url).toMatch(/^data:image\/gif;base64,/);
    expect(result.url.length).toBeGreaterThan(22);
  });
});
