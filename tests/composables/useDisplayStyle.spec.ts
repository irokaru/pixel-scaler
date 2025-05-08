import { describe, expect, test, beforeEach } from "vitest";
import { nextTick } from "vue";

import { ResultDisplayStyleType } from "@/@types/form";
import useDisplayStyle from "@/composables/useDisplayStyle";
import { StorageKey } from "@/constants/displayStyle";
import { setLocalStorage } from "@/core/infrastructure/storage";

describe("useDisplayStyle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test.each<{
    description: string;
    stored: unknown;
    localStorageValue: string | null;
    expectedInitial: ResultDisplayStyleType;
  }>([
    {
      description: "returns 'grid' when localStorage has 'grid'",
      localStorageValue: "grid",
      stored: "grid",
      expectedInitial: "grid",
    },
    {
      description: "returns 'list' when localStorage has 'list'",
      localStorageValue: "list",
      stored: "list",
      expectedInitial: "list",
    },
    {
      description: "returns default 'grid' when localStorage has unknown value",
      localStorageValue: "unknown",
      stored: "unknown",
      expectedInitial: "grid",
    },
    {
      description: "returns default 'grid' when localStorage is empty",
      localStorageValue: null,
      stored: null,
      expectedInitial: "grid",
    },
  ])("$description", ({ localStorageValue, expectedInitial }) => {
    if (localStorageValue !== null) {
      setLocalStorage(StorageKey, localStorageValue);
    }

    const { displayStyle } = useDisplayStyle();

    expect(displayStyle.value).toBe(expectedInitial);
  });

  test("saves updated displayStyle to localStorage", async () => {
    setLocalStorage(StorageKey, "grid");

    const { displayStyle } = useDisplayStyle();

    displayStyle.value = "list";
    await nextTick();

    expect(localStorage.getItem(StorageKey)).toBe("list");
  });
});
