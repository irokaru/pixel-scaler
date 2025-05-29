import { nextTick } from "vue";

import usePath from "@/composables/usePath";
import { OutputPathStorageKey } from "@/constants/form";
import * as storage from "@/core/infrastructure/storage";

describe("usePath", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  test("should initialize outputPath with value from localStorage", () => {
    vi.spyOn(storage, "getLocalStorage").mockReturnValue("test-path");
    const { outputPath } = usePath();
    expect(outputPath.value).toBe("test-path");
    expect(storage.getLocalStorage).toHaveBeenCalledWith(OutputPathStorageKey);
  });

  test("should initialize outputPath as empty string if no value in localStorage", () => {
    vi.spyOn(storage, "getLocalStorage").mockReturnValue(null);
    const { outputPath } = usePath();
    expect(outputPath.value).toBe("");
  });

  test("should update localStorage when outputPath changes", async () => {
    vi.spyOn(storage, "getLocalStorage").mockReturnValue("initial");
    const setLocalStorageMock = vi
      .spyOn(storage, "setLocalStorage")
      .mockImplementation(() => {});
    const { outputPath } = usePath();
    outputPath.value = "new-path";
    await nextTick();
    expect(setLocalStorageMock).toHaveBeenCalledWith(
      OutputPathStorageKey,
      "new-path",
    );
  });
});
