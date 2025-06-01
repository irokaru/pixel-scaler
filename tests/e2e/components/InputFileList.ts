import path from "node:path";

import { expect } from "@playwright/test";

import { PageObjectBase } from "./_PageObjectBase";
import { InputFileItem } from "./InputFileItem";

export class InputFileList extends PageObjectBase {
  async expectNotUploadedFile() {
    const fileInputArea = this.page.getByTestId("file-input-area");
    expect(await fileInputArea.locator("> div").all()).toHaveLength(1);
    await expect(fileInputArea.locator("svg.fa-images")).not.toBeVisible();
    await expect(fileInputArea.locator("svg.fa-trash")).not.toBeVisible();
  }

  async expectUploadedFilePresent() {
    const fileInputArea = this.page.getByTestId("file-input-area");
    await expect(fileInputArea.locator("> div")).toHaveCount(2, {
      timeout: 10_000,
    });

    const inputFileHeader = fileInputArea.locator("> div").nth(0);
    await expect(inputFileHeader.locator("svg.fa-images")).toBeVisible();
    await expect(inputFileHeader.locator("svg.fa-trash")).toBeVisible();
  }

  async expectExistsUploadedFilename(fileName: string) {
    const fileInputArea = this.page.getByTestId("file-input-area");
    const inputFileList = fileInputArea.locator("> div").nth(1);
    await expect(inputFileList).toBeVisible();
    await expect(
      inputFileList.locator(".input-file-list-item__main__title", {
        hasText: fileName,
      }),
    ).toBeVisible();
  }

  async clickDeleteAllFilesButton() {
    const inputErrorList = this.page.locator("#input-error-list");
    await inputErrorList.locator("svg.fa-trash").click();
  }

  async expectVisibleInputError() {
    const inputErrorList = this.page.locator("#input-error-list");
    await expect(inputErrorList).toBeVisible();
  }

  async expectNotVisibleInputError() {
    const inputErrorList = this.page.locator("#input-error-list");
    await expect(inputErrorList).not.toBeVisible();
  }

  async expectExistsInputErrorMessage(errorMessage: string) {
    const inputErrorList = this.page.locator("#input-error-list");
    await expect(inputErrorList).toBeVisible();
    await expect(
      inputErrorList.locator(".input-error-list__item", {
        hasText: errorMessage,
      }),
    ).toBeVisible();
  }

  async uploadImages(filePaths: string[]) {
    const fileInput = this.page
      .getByTestId("file-input-area")
      .locator('input[type="file"]');
    await fileInput.setInputFiles(filePaths);
  }

  async uploadAndGetItems(filePaths: string[]) {
    await this.uploadImages(filePaths);
    return filePaths.map(
      (filePath) => new InputFileItem(this.page, path.basename(filePath)),
    );
  }
}
