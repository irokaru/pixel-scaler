import { expect, Locator, Page } from "@playwright/test";

import { PageObjectBase } from "./_PageObjectBase";

export class InputFileItem extends PageObjectBase {
  protected inputFileItem: Locator;

  constructor(
    protected readonly page: Page,
    public readonly fileName: string,
  ) {
    super(page);
    const fileInputArea = this.page.getByTestId("file-input-area");
    const inputFileList = fileInputArea.locator("> div").nth(1);
    this.inputFileItem = inputFileList.locator(".input-file-list-item", {
      hasText: this.fileName,
    });
  }

  async exists() {
    await expect(this.inputFileItem).toBeVisible();
  }

  async notExists() {
    await expect(this.inputFileItem).not.toBeVisible();
  }

  async clickCheckBox() {
    await this.inputFileItem.getByRole("checkbox").click();
  }

  async changeScaleSizePercent(percent: number) {
    const input = this.input("scaleSizePercent");
    await this.fillAndBlur(input, String(percent));
  }

  async expectScaleSizePercent(percent: number) {
    await expect(this.input("scaleSizePercent")).toHaveValue(String(percent));
  }

  async changeOriginalPixelSize(size: number) {
    const input = this.input("originalPixelSize");
    await this.fillAndBlur(input, String(size));
  }

  async expectOriginalPixelSize(size: number) {
    await expect(this.input("originalPixelSize")).toHaveValue(String(size));
  }

  async changeScaleMode(scaleMode: string) {
    const input = this.input("scaleMode");
    await input.selectOption(scaleMode);
    await input.blur();
  }

  async expectScaleMode(scaleMode: string) {
    await expect(this.input("scaleMode")).toHaveValue(scaleMode);
  }

  async clickConvertButton() {
    await this.inputFileItem.locator("svg.fa-rotate").click();
  }

  async clickDeleteButton() {
    await this.inputFileItem.locator("svg.fa-trash").click();
  }

  async expectVisibleError() {
    await expect(
      this.inputFileItem.getByTestId(`errors-${this.fileName}`),
    ).toBeVisible();
  }

  async expectNotVisibleError() {
    await expect(
      this.inputFileItem.getByTestId(`errors-${this.fileName}`),
    ).not.toBeVisible();
  }

  async clickErrorShowButton() {
    await this.inputFileItem.getByTestId(`errors-${this.fileName}`).click();
  }

  async expectVisibleErrorList() {
    await expect(
      this.inputFileItem.getByTestId(`errors-list-${this.fileName}`),
    ).toBeVisible();
  }

  async expectNotVisibleErrorList() {
    await expect(
      this.inputFileItem.getByTestId(`errors-list-${this.fileName}`),
    ).not.toBeVisible();
  }

  async expectContainMessageInErrorList(errorMessage: string) {
    const errorList = this.inputFileItem.getByTestId(
      `errors-list-${this.fileName}`,
    );
    await expect(
      errorList.locator("li", { hasText: errorMessage }),
    ).toBeVisible();
  }

  async clickClearErrorButton() {
    await this.inputFileItem
      .getByTestId(`clear-errors-${this.fileName}`)
      .click();
  }

  protected input(name: string) {
    return this.inputFileItem.locator(`[name="${name}-${this.fileName}"]`);
  }

  protected async fillAndBlur(input: Locator, value: string) {
    await input.fill(value);
    await input.blur();
  }
}
