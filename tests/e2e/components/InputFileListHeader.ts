import { PageObjectBase } from "./_PageObjectBase";

export class InputFileListHeader extends PageObjectBase {
  async clickConvertAllButton() {
    const fileInputArea = this.page.getByTestId("file-input-area");
    await fileInputArea.locator("svg.fa-images").click();
  }

  async clickDeleteAllButton() {
    const fileInputArea = this.page.getByTestId("file-input-area");
    await fileInputArea.locator("svg.fa-trash").click();
  }

  async clickApplyAllButton() {
    const fileInputArea = this.page.getByTestId("file-input-area");
    await fileInputArea.locator("svg.fa-sliders").click();
  }

  async changeScaleSizePercent(percent: number) {
    const fileInputArea = this.page.getByTestId("file-input-area");
    const scaleSizePercentInput = fileInputArea.getByRole("spinbutton", {
      name: "scale",
    });
    await scaleSizePercentInput.fill(String(percent));
    await scaleSizePercentInput.blur();
  }

  async changeOriginalPixelSize(size: number) {
    const fileInputArea = this.page.getByTestId("file-input-area");
    const originalPixelSizeInput = fileInputArea.getByRole("spinbutton", {
      name: "pixel",
    });
    await originalPixelSizeInput.fill(String(size));
    await originalPixelSizeInput.blur();
  }

  async changeScaleMode(scaleMode: string) {
    const fileInputArea = this.page.getByTestId("file-input-area");
    const scaleModeInput = fileInputArea.getByRole("combobox", {
      name: "mode",
    });
    await scaleModeInput.selectOption(scaleMode);
    await scaleModeInput.blur();
  }
}
