vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));
vi.mock("@tauri-apps/api/path", () => ({ normalize: vi.fn() }));
vi.mock("@tauri-apps/plugin-dialog", () => ({ open: vi.fn() }));
vi.mock("@tauri-apps/plugin-fs", () => ({ exists: vi.fn() }));
vi.mock("@/core/plugins/i18n", () => ({
  vueI18n: {
    global: {
      t: vi.fn((key: string) => key),
    },
  },
}));
vi.mock("@/core/system", () => ({ isWeb: vi.fn() }));

import { invoke } from "@tauri-apps/api/core";
import { normalize } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { exists } from "@tauri-apps/plugin-fs";
import { ref, nextTick, Ref } from "vue";

import usePathSelector from "@/composables/usePathSelector";
import { isWeb } from "@/core/system";

const invokeMock = vi.mocked(invoke);
const normalizeMock = vi.mocked(normalize);
const openMock = vi.mocked(open);
const existsMock = vi.mocked(exists);
const isWebMock = vi.mocked(isWeb);
isWebMock.mockReturnValue(false); // Force standalone mode for tests

// 非同期処理をより確実に待機するための関数
const flushPromises = async () => {
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 10));
};

describe("usePathSelector", () => {
  let pathRef: Ref<string>;
  let errorRef: Ref<string>;

  const setup = (initialValue: string) => {
    pathRef = ref(initialValue);
    const { error, browseDir } = usePathSelector(pathRef);
    errorRef = error;
    return { browseDir };
  };

  test.each([
    {
      description: "sets error if path is empty",
      initialPath: "",
      allowedRoot: "/home/user",
      normalizedPath: "",
      exists: true,
      expectedError: "path-selector.empty-path",
    },
    {
      description: "sets error if path is not in allowed root",
      initialPath: "/not/home/user",
      allowedRoot: "/home/user",
      normalizedPath: "/not/home/user",
      exists: true,
      expectedError: "path-selector.path-not-in-allowed-root",
    },
    {
      description: "sets error if path does not exist",
      initialPath: "/home/user/folder",
      allowedRoot: "/home/user",
      normalizedPath: "/home/user/folder",
      exists: false,
      expectedError: "path-selector.path-does-not-exist",
    },
  ])(
    "$description",
    async ({
      initialPath,
      allowedRoot,
      normalizedPath,
      exists,
      expectedError,
    }) => {
      invokeMock.mockResolvedValue(allowedRoot);

      normalizeMock.mockImplementation(async (p: string) => {
        if (p === initialPath) return normalizedPath;
        if (p === allowedRoot) return allowedRoot;
        return p;
      });

      existsMock.mockResolvedValue(exists);

      setup(initialPath);

      // FIXME: more good way to wait for async validation
      await flushPromises();

      expect(errorRef.value).toBe(expectedError);
    },
  );

  test("clears error if path is valid", async () => {
    invokeMock.mockResolvedValue("/home/user");
    normalizeMock.mockResolvedValue("/home/user/folder");
    existsMock.mockResolvedValue(true);

    setup("/home/user/folder");
    await flushPromises();
    expect(errorRef.value).toBe("");
  });

  test("browseDir updates path when directory is selected", async () => {
    invokeMock.mockResolvedValue("/home/user");
    normalizeMock.mockResolvedValue("/home/user/folder");
    existsMock.mockResolvedValue(true);
    openMock.mockResolvedValue("/home/user/new");

    const { browseDir } = setup("/home/user/old");
    await flushPromises();

    await browseDir();
    await flushPromises();
    expect(pathRef.value).toBe("/home/user/new");
  });

  test("browseDir does not update path when cancelled", async () => {
    invokeMock.mockResolvedValue("/home/user");
    normalizeMock.mockResolvedValue("/home/user/folder");
    existsMock.mockResolvedValue(true);
    openMock.mockResolvedValue(null);

    const { browseDir } = setup("/home/user/old");
    await flushPromises();

    await browseDir();
    await flushPromises();
    expect(pathRef.value).toBe("/home/user/old");
  });
});
