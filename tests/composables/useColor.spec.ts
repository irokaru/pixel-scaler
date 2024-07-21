import { nextTick } from "vue";

import { Color } from "@/@types/color";
import useColor from "@/composables/useColor";
import { getColorSettingsList } from "@/controllers/colorController";

describe("useColor", () => {
  const DEFAULT_COLOR = "red";
  beforeEach(() => {
    localStorage.setItem("color", DEFAULT_COLOR);
  });

  test.each<{
    description: string;
    newColorKey: string;
    expecterColorSetting: Color;
  }>([
    {
      description:
        "should update the color settings when updateColorKey is called",
      newColorKey: "blue",
      expecterColorSetting: getColorSettingsList().blue,
    },
    {
      description:
        "should not update the color settings when an invalid color key is provided",
      newColorKey: "invalid_color",
      expecterColorSetting: getColorSettingsList().red,
    },
  ])(`$description`, async ({ newColorKey, expecterColorSetting }) => {
    const { themeColorKey, themeColor } = useColor();
    themeColorKey.value = newColorKey;
    await nextTick();
    expect(themeColor.value).toEqual(expecterColorSetting);
  });
});
