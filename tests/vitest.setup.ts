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
