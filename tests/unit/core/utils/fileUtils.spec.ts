import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/core/infrastructure/app", () => ({
  isWeb: vi.fn(),
}));

vi.mock("@tauri-apps/plugin-fs", () => ({
  writeFile: vi.fn(),
  BaseDirectory: { Home: "Home" },
}));

import { isWeb } from "@/core/infrastructure/app";

import { writeFile } from "@tauri-apps/plugin-fs";

import { downloadBytes } from "@/core/utils/fileUtils";

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
