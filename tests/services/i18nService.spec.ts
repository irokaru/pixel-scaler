import { Mock } from "vitest";

import {
  getLocalStorage,
  setLocalStorage,
} from "@/core/infrastructure/storage";
import { getBrowserLanguage, isUnite } from "@/core/system";
import { loadLanguageKey, saveLanguageKey } from "@/services/i18nService";

vi.mock("@/core/infrastructure/storage");
vi.mock("@/core/system");

describe("loadLanguageKey", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test.each<{
    description: string;
    expected: string;
    storedLang: string | null;
    browserLang: string | null;
    unite: boolean;
  }>([
    {
      description: "should return stored language if it exists",
      expected: "ja",
      storedLang: "ja",
      browserLang: null,
      unite: false,
    },
    {
      description:
        "should return stored language if it exists when unite is true",
      expected: "en",
      storedLang: "en",
      browserLang: null,
      unite: true,
    },
    {
      description:
        "should return browser language if stored language does not exist",
      expected: "en",
      storedLang: null,
      browserLang: "en",
      unite: false,
    },
    {
      description:
        "should return default language if stored language and browser language do not exist",
      expected: "en",
      storedLang: null,
      browserLang: null,
      unite: false,
    },
    {
      description:
        "should return default language even if it is unsupported when unite is true",
      expected: "en",
      storedLang: "tr",
      browserLang: "es",
      unite: true,
    },
    {
      description: "should return stored language even if it is unsupported",
      expected: "en",
      storedLang: "unsupported",
      browserLang: "ja",
      unite: true,
    },
  ])("$description", ({ expected, storedLang, browserLang, unite }) => {
    (getLocalStorage as Mock).mockReturnValue(storedLang);
    (getBrowserLanguage as Mock).mockReturnValue(browserLang);
    (isUnite as Mock).mockReturnValue(unite);
    expect(loadLanguageKey()).toBe(expected);
  });
});

describe("saveLanguageKey", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test.each<{
    description: string;
    input: string;
    expected: string | null;
    unite: boolean;
  }>([
    {
      description: "should store language if it is supported",
      input: "ja",
      expected: "ja",
      unite: false,
    },
    {
      description: "should not store language if it is not supported",
      input: "unsupported",
      expected: null,
      unite: false,
    },
    {
      description:
        "should store language if it is supported when unite is true",
      input: "cn",
      expected: "cn",
      unite: true,
    },
    {
      description:
        "should not store language if it is not supported when unite is true",
      input: "tr",
      expected: null,
      unite: true,
    },
  ])("$description", ({ input, expected, unite }) => {
    (isUnite as Mock).mockReturnValue(unite);
    saveLanguageKey(input);
    if (expected) {
      expect(setLocalStorage).toHaveBeenCalledWith("language", expected);
    } else {
      expect(setLocalStorage).not.toHaveBeenCalled();
    }
  });
});
