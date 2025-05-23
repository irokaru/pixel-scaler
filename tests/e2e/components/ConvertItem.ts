import { Locator, Page, expect } from "@playwright/test";

import { PageObjectBase } from "./_PageObjectBase";

export class ConvertItem extends PageObjectBase {
  protected readonly convertItem: Locator;
  constructor(
    protected readonly page: Page,
    public readonly fileName: string,
    opts: {
      scaleSizePercent: number;
      originalPixelSize: number;
      scaleMode: string;
    },
  ) {
    super(page);
    this.convertItem = this.page
      .locator(".scaled-image-list")
      .locator(".scaled-image-list-item")
      .filter({
        has: this.page.locator(
          `[name="checked-scaled-${opts.scaleSizePercent}-${opts.originalPixelSize}-${opts.scaleMode}-${this.fileName}"]`,
        ),
      });
  }

  async exists() {
    await expect(this.convertItem).toBeVisible();
  }

  async notExists() {
    await expect(this.convertItem).not.toBeVisible();
  }

  async clickCheckBox() {
    await this.convertItem.getByRole("checkbox").click();
  }

  async clickDownloadButton() {
    await this.convertItem.locator("svg.fa-download").click();
  }

  async clickDeleteButton() {
    await this.convertItem.locator("svg.fa-trash").click();
  }
}
