import useScaleSettings from "@/composables/useScaleSettings";
import {
  OriginalPixelSize,
  ScaleModes,
  ScaleSizePercent,
} from "@/constants/form";

describe("useScaleSettings", () => {
  test("should initialize originalPixelSize with the default value", () => {
    const { originalPixelSize } = useScaleSettings();
    expect(originalPixelSize.value).toBe(OriginalPixelSize.Default);
  });

  test("should initialize scaleMode with the first value in ScaleModes", () => {
    const { scaleMode } = useScaleSettings();
    expect(scaleMode.value).toBe(ScaleModes[0].value);
  });

  test("should initialize scaleSizePercent with the default value", () => {
    const { scaleSizePercent } = useScaleSettings();
    expect(scaleSizePercent.value).toBe(ScaleSizePercent.Default);
  });

  test("should return refs that are reactive", () => {
    const { originalPixelSize, scaleMode, scaleSizePercent } =
      useScaleSettings();

    originalPixelSize.value = 10;
    scaleMode.value = ScaleModes[1].value;
    scaleSizePercent.value = 50;

    expect(originalPixelSize.value).toBe(10);
    expect(scaleMode.value).toBe(ScaleModes[1].value);
    expect(scaleSizePercent.value).toBe(50);
  });
});
