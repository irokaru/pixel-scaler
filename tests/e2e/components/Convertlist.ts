import { expect, Locator, Page } from "@playwright/test";

import { ResultDisplayStyleType } from "@/@types/form";

import { PageObjectBase } from "./_PageObjectBase";

export class ConvertList extends PageObjectBase {
  public readonly convertList: Locator;

  constructor(protected readonly page: Page) {
    super(page);
    this.convertList = this.page.locator(".scaled-image-list");
  }

  async exists() {
    await expect(this.convertList).toBeVisible();
  }

  async notExists() {
    await expect(this.convertList).not.toBeVisible();
  }

  async clickDownloadZipButton() {
    await this.convertList
      .locator(".scaled-image-list__ctrl")
      .locator("svg.fa-file-zipper")
      .click();
  }

  async clickDeleteAllButton() {
    await this.convertList
      .locator(".scaled-image-list__ctrl")
      .locator("svg.fa-trash")
      .click();
  }

  async selectDisplayStyle(style: ResultDisplayStyleType) {
    await this.convertList
      .locator(".scaled-image-list__ctrl")
      .locator("label", { hasText: style })
      .check();
  }
}
