import {
  colors,
  getColorKey,
  getColorSettings,
  setColorKey,
} from "../services/colorService";

describe("getColorKey", () => {
  it("should return the default color key if local storage does not exist", () => {
    const result = getColorKey();
    expect(result).toBe("red");
  });

  it("should return the color key from local storage if it exists", () => {
    localStorage.setItem("color", "blue");
    const result = getColorKey();

    expect(result).toBe("blue");
  });

  it("should return the default color key if the color key from local storage does not exist in the colors object", () => {
    localStorage.setItem("color", "invalid_color");

    const result = getColorKey();
    expect(result).toBe("red");

    localStorage.removeItem("color");
  });
});

describe("getColorSettings", () => {
  it("should return the color settings based on the current color key", () => {
    const result = getColorSettings();
    expect(result).toEqual(colors[getColorKey()]);
  });
});

describe("setColorKey", () => {
  beforeEach(() => {
    localStorage.removeItem("color");
  });

  it.each(Object.keys(colors))(
    "should set the color key in local storage if the provided key exists in the colors object (%s)",
    (key) => {
      setColorKey(key);
      expect(localStorage.getItem("color")).toBe(key);
    },
  );

  it("should not set the color key in local storage if the provided key does not exist in the colors object", () => {
    const key = "invalid_color";
    setColorKey(key);

    expect(localStorage.getItem("color")).toBeNull();
  });
});
