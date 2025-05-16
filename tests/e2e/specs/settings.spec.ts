import { test, expect } from "@playwright/test";

import { ColorKeys } from "@/core/constants/color";

import { SettingsSection } from "../components/SettingsSection";

test.describe("settings", () => {
  test("change color settings", async ({ page }) => {
    await page.goto("/");
    const settingsSection = new SettingsSection(page);

    for (const color of ColorKeys) {
      await test.step(`change to ${color}`, async () => {
        await settingsSection.clickColorButton(color);
        await expect(page.locator("html")).toHaveAttribute(
          "data-color-theme",
          color,
        );
      });

      await test.step(`set color is hold after reload`, async () => {
        await page.reload();
        await expect(page.locator("html")).toHaveAttribute(
          "data-color-theme",
          color,
        );
      });
    }
  });

  test("change language settings", async ({ page }) => {
    await page.goto("/");
    const settingsSection = new SettingsSection(page);

    for (const language of SettingsSection.languages) {
      await test.step(`change to ${language}`, async () => {
        await settingsSection.clickLanguageButton(language);
        await expect(page.locator("html")).toHaveAttribute("lang", language);
      });
    }
  });
});
