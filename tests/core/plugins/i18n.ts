import { nextTick } from "vue";

import useI18n from "@/composables/useI18n";
import { vueI18nLocales } from "@/core/plugins/i18n";

describe("i18n", () => {
  const DEFAULT_I18N = "en";
  beforeEach(() => {
    localStorage.setItem("i18n", DEFAULT_I18N);
  });

  test.each<{
    description: string;
    newLanguageKey: vueI18nLocales;
    expectedLanguageKey: vueI18nLocales;
  }>([
    {
      description:
        "should update the language when updateLanguageKey is called",
      newLanguageKey: "ja",
      expectedLanguageKey: "ja",
    },
  ])(`$description`, async ({ newLanguageKey, expectedLanguageKey }) => {
    const { languageKey } = useI18n();
    languageKey.value = newLanguageKey;
    await nextTick();
    expect(languageKey.value).toBe(expectedLanguageKey);
  });
});
