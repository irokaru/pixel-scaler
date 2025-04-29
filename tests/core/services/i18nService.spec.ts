import { LanguageKey } from "@/core/@types/i18n";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/core/infrastructure/storage";
import {
  loadLanguageKeyInStorage,
  saveLanguageKey,
} from "@/core/services/i18nService";
import { getBrowserLanguage, isUnite } from "@/core/system";

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
    vi.mocked(getLocalStorage).mockReturnValue(storedLang);
    vi.mocked(getBrowserLanguage).mockReturnValue(browserLang as string);
    vi.mocked(isUnite).mockReturnValue(unite);
    expect(loadLanguageKeyInStorage()).toBe(expected);
  });
});

describe("saveLanguageKey", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test.each<{
    description: string;
    input: LanguageKey;
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
      input: "unsupported" as LanguageKey,
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
    vi.mocked(isUnite).mockReturnValue(unite);
    saveLanguageKey(input);
    if (expected) {
      expect(setLocalStorage).toHaveBeenCalledWith("language", expected);
    } else {
      expect(setLocalStorage).not.toHaveBeenCalled();
    }
  });
});
