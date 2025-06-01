import { ColorKey } from "@/core/@types/color";
import { StorageKey } from "@/core/constants/color";
import {
  getAllColors,
  loadColorKeyInStorage,
  saveColorKey,
} from "@/core/services/colorService";

describe("loadColorKeyInStorage", () => {
  beforeEach(() => {
    localStorage.removeItem(StorageKey);
  });

  test("should return the default color key if local storage does not exist", () => {
    const result = loadColorKeyInStorage();
    expect(result).toBe("red");
  });

  test("should return the color key from local storage if it exists", () => {
    localStorage.setItem("color", "blue");
    const result = loadColorKeyInStorage();

    expect(result).toBe("blue");
  });

  test("should return the default color key if the color key from local storage does not exist in the colors object", () => {
    localStorage.setItem("color", "invalid_color");

    const result = loadColorKeyInStorage();
    expect(result).toBe("red");
  });
});

describe("saveColorKey", () => {
  beforeEach(() => {
    localStorage.removeItem(StorageKey);
  });

  test.each(Object.keys(getAllColors()))(
    "should set the color key in local storage if the provided key exists in the colors object (%s)",
    (key) => {
      saveColorKey(key as ColorKey);
      expect(localStorage.getItem("color")).toBe(key);
    },
  );

  test("should not set the color key in local storage if the provided key does not exist in the colors object", () => {
    const key = "invalid_color";
    saveColorKey(key as ColorKey);

    expect(localStorage.getItem("color")).toBeNull();
  });
});
