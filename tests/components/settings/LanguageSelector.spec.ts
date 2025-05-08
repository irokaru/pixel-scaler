import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import LanguageSelector from "@/components/settings/LanguageSelector.vue";
import useI18n from "@/composables/useI18n";
import { vueI18nLocales } from "@/core/plugins/i18n";

describe("LanguageSelector.vue", () => {
  test("renders all language options", () => {
    const wrapper = mount(LanguageSelector);
    const languageOptions = wrapper.findAll(".box");
    expect(languageOptions.length).toBe(vueI18nLocales.length);
  });

  test("updates the languageKey when a language is clicked", async () => {
    const { languageKey } = useI18n();
    const wrapper = mount(LanguageSelector);
    const languageOptions = wrapper.findAll(".box");

    for (const option of languageOptions) {
      await option.trigger("click");
      await nextTick();
      expect(languageKey.value).toBe(option.text());
    }
  });
});
