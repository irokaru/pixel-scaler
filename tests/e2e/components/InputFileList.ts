import { expect } from "@playwright/test";

import { PageObjectBase } from "./_PageObjectBase";

export class InputFileList extends PageObjectBase {
  async isNotUploadedFile() {
    const inputFileList = this.page.getByTestId("input-file-list");

    expect(await inputFileList.locator("div").all()).toHaveLength(0);

    await expect(inputFileList.locator("svg.fa-images")).not.toBeVisible();
    await expect(inputFileList.locator("svg.fa-trash")).not.toBeVisible();
  }

  async isUploadedFile() {
    const inputFileList = this.page.getByTestId("input-file-list");

    expect(await inputFileList.locator("div").all()).toHaveLength(2);

    await expect(inputFileList.locator("svg.fa-images")).toBeVisible();
    await expect(inputFileList.locator("svg.fa-trash")).toBeVisible();
  }

  async uploadImage(filePath: string) {
    const input = await this.page.waitForSelector("input[type='file']");
    await input.setInputFiles(filePath);
  }

  async selectScaleMode(scaleMode: string) {
    const select = await this.page.waitForSelector("select");
    await select.selectOption({ label: scaleMode });
  }
}
