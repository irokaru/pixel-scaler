import { expect } from "@playwright/test";

import { PageObjectBase } from "./_PageObjectBase";

export class SettingsSection extends PageObjectBase {
  // FIXME: VITE_IS_UNITE is a temporary solution for the Unite version.
  static readonly languages = process.env.VITE_IS_UNITE
    ? ["ja", "en", "cn"]
    : ["ja", "en", "cn", "es", "tr"];

  async clickColorButton(buttonName: string) {
    const colorSection = this.page.locator("#colors-setting");
    const button = colorSection.getByTitle(buttonName, { exact: true });
    await expect(button).toBeVisible();
    await button.click();
  }

  async clickLanguageButton(buttonName: string) {
    const languageSection = this.page.locator("#languages-setting");
    const button = languageSection.getByText(buttonName);
    await expect(button).toBeVisible();
    await button.click();
  }
}
