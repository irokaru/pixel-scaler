import * as core from "@tauri-apps/api/core";
import * as fs from "@tauri-apps/plugin-fs";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";

import * as storage from "@/core/infrastructure/storage";
import * as system from "@/core/system";
import useOutputPathStore from "@/stores/outputPathStore";

const HomeDirMock = "/home/user";

vi.spyOn(core, "invoke").mockResolvedValue(HomeDirMock);
vi.spyOn(system, "isWeb").mockReturnValue(false);
const existsMock = vi.spyOn(fs, "exists").mockResolvedValue(true);

describe("outputPathStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  test("should initialize with value from localStorage", () => {
    vi.spyOn(storage, "getLocalStorage").mockReturnValueOnce("hogehoge");

    const store = useOutputPathStore();
    expect(store.outputPath).toBe("hogehoge");
  });

  describe("error", () => {
    test.each<{ description: string; path: string; error: string }>([
      {
        description: "should be empty error when outputPath is empty",
        path: "",
        error: "path-selector.empty-path",
      },
      // {
      //   description:
      //     "should be not allowed when outputPath is outside of allowed root",
      //   path: "/outside",
      //   error: "path-selector.path-not-in-allowed-root",
      // },
      {
        description: "should be not error when outputPath is valid",
        path: HomeDirMock,
        error: "",
      },
    ])("$description", async ({ path, error }) => {
      const store = useOutputPathStore();
      store.outputPath = path;

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 1));

      expect(store.error).toBe(error);
    });

    test("should be no exists when outputPath is no exists path", async () => {
      existsMock.mockResolvedValue(false);
      const store = useOutputPathStore();
      store.outputPath = HomeDirMock + "/no-exists-path";

      await nextTick();
      await new Promise((resolve) => setTimeout(resolve, 1));

      expect(store.error).toBe("path-selector.path-does-not-exist");
    });
  });
});
