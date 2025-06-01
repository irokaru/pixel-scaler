import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { config } from "@vue/test-utils";

beforeEach(() => {
  config.global.components = {
    FontAwesomeIcon,
  };
});

if (globalThis.ImageData === undefined) {
  globalThis.ImageData = class {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    colorSpace: PredefinedColorSpace;
    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.data = new Uint8ClampedArray(width * height * 4);
      this.colorSpace = "srgb";
    }
  } as unknown as typeof ImageData;
}

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue("/home/user"),
}));
vi.mock("@tauri-apps/api/path", () => ({
  normalize: vi.fn().mockImplementation((path) => Promise.resolve(path)),
}));
vi.mock("@tauri-apps/plugin-dialog", () => ({
  open: vi.fn(),
}));
vi.mock("@tauri-apps/plugin-fs", () => ({
  exists: vi.fn().mockResolvedValue(true),
}));
