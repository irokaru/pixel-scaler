import { unzipSync } from "fflate";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/core/infrastructure/app", () => ({
  isWeb: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-fs", () => ({
  writeFile: vi.fn(),
  BaseDirectory: { Home: "Home" },
}));

import { ScaleMode } from "@/constants/form";
import { isWeb } from "@/core/infrastructure/app";

import { writeFile } from "@tauri-apps/plugin-fs";

import {
  createZipBlobFromScaledImages,
  downloadBytes,
} from "@/core/utils/fileUtils";
import type { ImageEntry } from "@/types/convert";

describe("downloadBytes", () => {
  const bytes = new Uint8Array([0x47, 0x49, 0x46, 0x38]);

  describe("web 環境", () => {
    beforeEach(() => {
      vi.mocked(isWeb).mockReturnValue(true);
    });

    test("should create object URL and trigger link click", async () => {
      const createObjectURL = vi
        .spyOn(URL, "createObjectURL")
        .mockReturnValue("blob:mock");
      const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL");
      const clickSpy = vi.fn();

      const createElement = vi
        .spyOn(document, "createElement")
        .mockImplementation((tag) => {
          if (tag === "a") {
            return {
              href: "",
              download: "",
              click: clickSpy,
            } as unknown as HTMLElement;
          }
          return document.createElement(tag);
        });

      await downloadBytes(bytes, "test.gif");

      expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock");

      createObjectURL.mockRestore();
      revokeObjectURL.mockRestore();
      createElement.mockRestore();
    });
  });

  describe("Tauri 環境", () => {
    beforeEach(() => {
      vi.mocked(isWeb).mockReturnValue(false);
    });

    test("should call writeFile with correct path", async () => {
      await downloadBytes(bytes, "test.gif", "/output");

      expect(writeFile).toHaveBeenCalledWith(
        "/output/test.gif",
        bytes,
        expect.objectContaining({ baseDir: "Home" }),
      );
    });
  });
});

describe("createZipBlobFromScaledImages", () => {
  const makeEntry = (
    url: string,
    originalFileBytes: Uint8Array<ArrayBuffer>,
  ): ImageEntry => ({
    image: {
      uuid: "test-uuid",
      data: new File([originalFileBytes], "test.gif", { type: "image/gif" }),
      imageData: null,
      frames: null,
      width: 2,
      height: 2,
      originalPixelSize: 16,
      url,
      status: "scaled",
      animated: true,
    },
    settings: { scaleSizePercent: 200, scaleMode: ScaleMode.Nearest },
    errors: [],
  });

  test("should use url bytes (converted content), not original file bytes", async () => {
    const convertedBytes = new Uint8Array([0x47, 0x49, 0x46, 0x39, 0x61]); // GIF89a header
    const b64 = btoa(String.fromCodePoint(...convertedBytes));
    const convertedUrl = `data:image/gif;base64,${b64}`;
    const originalBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]); // different content

    const entry = makeEntry(convertedUrl, originalBytes);
    const blob = await createZipBlobFromScaledImages([entry]);

    const zipBytes = new Uint8Array(await blob.arrayBuffer());
    const unzipped = unzipSync(zipBytes);
    const filePath = "nearest/org_16px/x200/test.gif";

    expect(unzipped[filePath]).toBeDefined();
    expect([...unzipped[filePath]]).toEqual([...convertedBytes]);
  });

  test("should not use original file bytes", async () => {
    const convertedBytes = new Uint8Array([0x47, 0x49, 0x46, 0x39, 0x61]);
    const b64 = btoa(String.fromCodePoint(...convertedBytes));
    const convertedUrl = `data:image/gif;base64,${b64}`;
    const originalBytes = new Uint8Array([0x00, 0x01, 0x02, 0x03]);

    const entry = makeEntry(convertedUrl, originalBytes);
    const blob = await createZipBlobFromScaledImages([entry]);

    const zipBytes = new Uint8Array(await blob.arrayBuffer());
    const unzipped = unzipSync(zipBytes);
    const filePath = "nearest/org_16px/x200/test.gif";

    expect([...unzipped[filePath]]).not.toEqual([...originalBytes]);
  });

  test("should build correct file path inside zip", async () => {
    const convertedBytes = new Uint8Array([0x47, 0x49, 0x46]);
    const b64 = btoa(String.fromCodePoint(...convertedBytes));
    const url = `data:image/gif;base64,${b64}`;

    const entry = makeEntry(url, convertedBytes);
    const blob = await createZipBlobFromScaledImages([entry]);

    const zipBytes = new Uint8Array(await blob.arrayBuffer());
    const unzipped = unzipSync(zipBytes);

    expect(Object.keys(unzipped)).toContain("nearest/org_16px/x200/test.gif");
  });

  test("should return a Blob with zip mime type", async () => {
    const b64 = btoa(String.fromCodePoint(0x47, 0x49, 0x46));
    const entry = makeEntry(`data:image/gif;base64,${b64}`, new Uint8Array());

    const blob = await createZipBlobFromScaledImages([entry]);

    expect(blob.type).toBe("application/zip");
  });
});
