import {
  getAllColors,
  loadColorKeyInStorage,
  getColorSettings,
  saveColorKey,
} from "@/services/colorService";

describe("loadColorKeyInStorage", () => {
  beforeEach(() => {
    localStorage.removeItem("color");
  });

  it("should return the default color key if local storage does not exist", () => {
    const result = loadColorKeyInStorage();
    expect(result).toBe("red");
  });

  it("should return the color key from local storage if it exists", () => {
    localStorage.setItem("color", "blue");
    const result = loadColorKeyInStorage();

    expect(result).toBe("blue");
  });

  it("should return the default color key if the color key from local storage does not exist in the colors object", () => {
    localStorage.setItem("color", "invalid_color");

    const result = loadColorKeyInStorage();
    expect(result).toBe("red");
  });
});

describe("getColorSettings", () => {
  it("should return the color settings based on the current color key", () => {
    const result = getColorSettings();
    expect(result).toEqual(getAllColors()[loadColorKeyInStorage()]);
  });
});

describe("saveColorKey", () => {
  beforeEach(() => {
    localStorage.removeItem("color");
  });

  it.each(Object.keys(getAllColors()))(
    "should set the color key in local storage if the provided key exists in the colors object (%s)",
    (key) => {
      saveColorKey(key);
      expect(localStorage.getItem("color")).toBe(key);
    },
  );

  it("should not set the color key in local storage if the provided key does not exist in the colors object", () => {
    const key = "invalid_color";
    saveColorKey(key);

    expect(localStorage.getItem("color")).toBeNull();
  });
});
