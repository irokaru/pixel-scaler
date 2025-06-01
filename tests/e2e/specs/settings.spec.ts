import { test, expect } from "@playwright/test";

import { ColorKeys } from "@/core/constants/color";

import { SettingsSection } from "../components/SettingsSection";

test.describe("SettingsSection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should change color theme and persist after reload", async ({
    page,
  }) => {
    const settingsSection = new SettingsSection(page);
    const html = page.locator("html");

    for (const color of ColorKeys) {
      await test.step(`change theme to ${color}`, async () => {
        await settingsSection.clickColorButton(color);
        await expect(html).toHaveAttribute("data-color-theme", color);
      });
    }

    await test.step("theme setting should persist after reload", async () => {
      await page.reload();
      await expect(html).toHaveAttribute(
        "data-color-theme",
        ColorKeys.at(-1) ?? "",
      );
    });
  });

  test("should change language and persist after reload", async ({ page }) => {
    const settingsSection = new SettingsSection(page);
    const html = page.locator("html");

    for (const language of SettingsSection.languages) {
      await test.step(`change language to ${language}`, async () => {
        await settingsSection.clickLanguageButton(language);
        await expect(html).toHaveAttribute("lang", language);
      });
    }

    await test.step("language setting should persist after reload", async () => {
      await page.reload();
      await expect(html).toHaveAttribute(
        "lang",
        SettingsSection.languages.at(-1) ?? "",
      );
    });
  });
});
