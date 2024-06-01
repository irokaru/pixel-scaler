import useColor from "@/composables/useColor";

describe("useColor", () => {
  const DEFAULT_COLOR = "red";
  beforeEach(() => {
    localStorage.setItem("color", DEFAULT_COLOR);
  });

  test.each<{
    description: string;
    newColorKey: string;
    expectedColorKey: string;
  }>([
    {
      description:
        "should update the color settings when updateColorKey is called",
      newColorKey: "blue",
      expectedColorKey: "blue",
    },
    {
      description:
        "should not update the color settings when an invalid color key is provided",
      newColorKey: "invalid_color",
      expectedColorKey: DEFAULT_COLOR,
    },
  ])(`$description`, ({ newColorKey, expectedColorKey }) => {
    const { updateColorKey, color, COLORS } = useColor();
    updateColorKey(newColorKey);
    expect(color.value).toEqual(COLORS[expectedColorKey]);
  });
});
