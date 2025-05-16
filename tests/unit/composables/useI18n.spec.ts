import { nextTick } from "vue";

import useI18n from "@/composables/useI18n";
import { StorageKey } from "@/core/constants/i18n";
import { getLocalStorage } from "@/core/infrastructure/storage";
import { vueI18n, vueI18nLocales } from "@/core/plugins/i18n";

describe("useI18n", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "";
    vueI18n.global.locale.value = "en";
  });

  test.each<{
    description: string;
    initialLocale: string;
    expectedLangAttr: string;
  }>([
    {
      description:
        "sets document lang and localStorage when initialized with 'en'",
      initialLocale: "en",
      expectedLangAttr: "en",
    },
    {
      description:
        "sets document lang and localStorage when initialized with 'ja'",
      initialLocale: "ja",
      expectedLangAttr: "ja",
    },
  ])("$description", async ({ initialLocale, expectedLangAttr }) => {
    vueI18n.global.locale.value = initialLocale as vueI18nLocales;

    const { languageKey } = useI18n();

    await nextTick();

    expect(languageKey.value).toBe(initialLocale);
    expect(document.documentElement.lang).toBe(expectedLangAttr);
    expect(getLocalStorage(StorageKey)).toBe(initialLocale);
  });

  test("updates languageKey and saves to localStorage", async () => {
    vueI18n.global.locale.value = "en";

    const { languageKey } = useI18n();

    languageKey.value = "ja";

    await nextTick();

    expect(document.documentElement.lang).toBe("ja");
    expect(getLocalStorage(StorageKey)).toBe("ja");
  });
});
