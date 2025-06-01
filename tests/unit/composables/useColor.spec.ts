import { nextTick } from "vue";

import useColor from "@/composables/useColor";
import { ColorKey } from "@/core/@types/color";

describe("useColor", () => {
  const DEFAULT_COLOR = "red";
  beforeEach(() => {
    localStorage.setItem("color", DEFAULT_COLOR);
  });

  test.each<{
    description: string;
    newColorKey: ColorKey;
    expecterColorSetting: string;
  }>([
    {
      description:
        "should update the color settings when updateColorKey is called",
      newColorKey: "blue",
      expecterColorSetting: "blue",
    },
  ])("$description", async ({ newColorKey, expecterColorSetting }) => {
    const { themeColorKey } = useColor();
    themeColorKey.value = newColorKey;
    await nextTick();
    expect(document.documentElement.dataset.colorTheme).toEqual(
      expecterColorSetting,
    );
  });
});
