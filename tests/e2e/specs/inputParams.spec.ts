import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "@playwright/test";

import {
  OriginalPixelSize,
  ScaleMode,
  ScaleSizePercent,
} from "@/constants/form";

import { InputFileList } from "../components/InputFileList";
import { InputFileListHeader } from "../components/InputFileListHeader";
import {
  ScaleSizePercentParams,
  OriginalPixelSizeParams,
} from "../constants/params";
import { testInputValidation } from "../util/testUtils";

const CurrentPath = path.dirname(fileURLToPath(import.meta.url));
const FixturePath = path.resolve(CurrentPath, "../../fixture");
const UploadItemPaths = [
  "1px.png",
  "2px.png",
  "1px.jpg",
  "2px.jpg",
  "1px_alpha.png",
  "2px_alpha.png",
].map((fileName) => path.resolve(FixturePath, fileName));

test.describe("Input parameter validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should validate and update scale size percent for each uploaded images", async ({
    page,
  }) => {
    const inputFileList = new InputFileList(page);
    const [inputFileItem, otherItem] =
      await inputFileList.uploadAndGetItems(UploadItemPaths);

    await testInputValidation({
      name: "scale size percent",
      ...ScaleSizePercentParams,
      min: ScaleSizePercent.Min,
      max: ScaleSizePercent.Max,
      set: async (value: number) =>
        await inputFileItem.changeScaleSizePercent(value),
      expect: async (value: number) => {
        await inputFileItem.expectScaleSizePercent(value);
        await inputFileItem.expectOriginalPixelSize(OriginalPixelSize.Default);
        await inputFileItem.expectScaleMode(ScaleMode.Smooth);
      },
    });

    await test.step("other image parameters should remain default", async () => {
      await otherItem.expectScaleSizePercent(ScaleSizePercent.Default);
      await otherItem.expectOriginalPixelSize(OriginalPixelSize.Default);
      await otherItem.expectScaleMode(ScaleMode.Smooth);
    });
  });

  test("should validate and update original pixel size for each uploaded images", async ({
    page,
  }) => {
    const inputFileList = new InputFileList(page);
    const [inputFileItem, otherItem] =
      await inputFileList.uploadAndGetItems(UploadItemPaths);

    await testInputValidation({
      name: "original pixel size",
      ...OriginalPixelSizeParams,
      min: OriginalPixelSize.Min,
      max: OriginalPixelSize.Max,
      set: async (value: number) =>
        await inputFileItem.changeOriginalPixelSize(value),
      expect: async (value: number) => {
        await inputFileItem.expectScaleSizePercent(ScaleSizePercent.Default);
        await inputFileItem.expectOriginalPixelSize(value);
        await inputFileItem.expectScaleMode(ScaleMode.Smooth);
      },
    });

    await test.step("other image parameters should remain default", async () => {
      await otherItem.expectScaleSizePercent(ScaleSizePercent.Default);
      await otherItem.expectOriginalPixelSize(OriginalPixelSize.Default);
      await otherItem.expectScaleMode(ScaleMode.Smooth);
    });
  });

  test("should apply scale mode to each uploaded images", async ({ page }) => {
    const inputFileList = new InputFileList(page);
    const [inputFileItem, otherItem] =
      await inputFileList.uploadAndGetItems(UploadItemPaths);

    for (const mode of Object.values(ScaleMode)) {
      await test.step(`change scale mode (${mode})`, async () => {
        await inputFileItem.changeScaleMode(mode);
        await inputFileItem.expectScaleMode(mode);
      });
    }

    await test.step("other image parameters should remain default", async () => {
      await otherItem.expectScaleSizePercent(ScaleSizePercent.Default);
      await otherItem.expectOriginalPixelSize(OriginalPixelSize.Default);
      await otherItem.expectScaleMode(ScaleMode.Smooth);
    });
  });

  test("should apply scale size percent changes to all uploaded images via header controls", async ({
    page,
  }) => {
    const inputFileList = new InputFileList(page);
    const inputFileListHeader = new InputFileListHeader(page);
    const inputFileItems =
      await inputFileList.uploadAndGetItems(UploadItemPaths);

    await testInputValidation({
      name: "scale size percent",
      ...ScaleSizePercentParams,
      min: ScaleSizePercent.Min,
      max: ScaleSizePercent.Max,
      set: async (value: number) => {
        await inputFileListHeader.changeScaleSizePercent(value);
        await inputFileListHeader.clickApplyAllButton();
      },
      expect: async (value: number) => {
        for (const inputFileItem of inputFileItems) {
          await inputFileItem.expectScaleSizePercent(value);
          await inputFileItem.expectOriginalPixelSize(
            OriginalPixelSize.Default,
          );
          await inputFileItem.expectScaleMode(ScaleMode.Smooth);
        }
      },
    });
  });

  test("should apply scale size percent changes to all checked images via header controls", async ({
    page,
  }) => {
    const inputFileList = new InputFileList(page);
    const inputFileListHeader = new InputFileListHeader(page);
    const inputFileItems =
      await inputFileList.uploadAndGetItems(UploadItemPaths);
    // FIXME: randomly checked items
    const checkedInputFileItems = [
      ...inputFileItems.splice(0, 1),
      ...inputFileItems.splice(3, 2),
    ];
    const uncheckedInputFileItems = inputFileItems.filter(
      (inputFileItem) =>
        !checkedInputFileItems.some(
          (item) => item.fileName === inputFileItem.fileName,
        ),
    );
    await test.step("check images", async () => {
      for (const checkedInputFileItem of checkedInputFileItems) {
        await checkedInputFileItem.clickCheckBox();
      }
    });

    await testInputValidation({
      name: "scale size percent",
      ...ScaleSizePercentParams,
      min: ScaleSizePercent.Min,
      max: ScaleSizePercent.Max,
      set: async (value: number) => {
        await inputFileListHeader.changeScaleSizePercent(value);
        await inputFileListHeader.clickApplyAllButton();
      },
      expect: async (value: number) => {
        for (const inputFileItem of checkedInputFileItems) {
          await inputFileItem.expectScaleSizePercent(value);
          await inputFileItem.expectOriginalPixelSize(
            OriginalPixelSize.Default,
          );
          await inputFileItem.expectScaleMode(ScaleMode.Smooth);
        }
        for (const inputFileItem of uncheckedInputFileItems) {
          await inputFileItem.expectScaleSizePercent(ScaleSizePercent.Default);
          await inputFileItem.expectOriginalPixelSize(
            OriginalPixelSize.Default,
          );
          await inputFileItem.expectScaleMode(ScaleMode.Smooth);
        }
      },
    });
  });

  test("should apply original pixel size changes to all uploaded images via header controls", async ({
    page,
  }) => {
    const inputFileList = new InputFileList(page);
    const inputFileListHeader = new InputFileListHeader(page);
    const inputFileItems =
      await inputFileList.uploadAndGetItems(UploadItemPaths);

    await testInputValidation({
      name: "original pixel size",
      ...OriginalPixelSizeParams,
      min: OriginalPixelSize.Min,
      max: OriginalPixelSize.Max,
      set: async (value: number) => {
        await inputFileListHeader.changeOriginalPixelSize(value);
        await inputFileListHeader.clickApplyAllButton();
      },
      expect: async (value: number) => {
        for (const inputFileItem of inputFileItems) {
          await inputFileItem.expectScaleSizePercent(ScaleSizePercent.Default);
          await inputFileItem.expectOriginalPixelSize(value);
          await inputFileItem.expectScaleMode(ScaleMode.Smooth);
        }
      },
    });
  });

  test("should apply original pixel size changes to all checked images via header controls", async ({
    page,
  }) => {
    const inputFileList = new InputFileList(page);
    const inputFileListHeader = new InputFileListHeader(page);
    const inputFileItems =
      await inputFileList.uploadAndGetItems(UploadItemPaths);
    // FIXME: randomly checked items
    const checkedInputFileItems = [
      ...inputFileItems.splice(1, 1),
      ...inputFileItems.splice(3, 2),
    ];
    const uncheckedInputFileItems = inputFileItems.filter(
      (inputFileItem) =>
        !checkedInputFileItems.some(
          (item) => item.fileName === inputFileItem.fileName,
        ),
    );
    await test.step("check images", async () => {
      for (const checkedInputFileItem of checkedInputFileItems) {
        await checkedInputFileItem.clickCheckBox();
      }
    });

    await testInputValidation({
      name: "original pixel size",
      ...OriginalPixelSizeParams,
      min: OriginalPixelSize.Min,
      max: OriginalPixelSize.Max,
      set: async (value: number) => {
        await inputFileListHeader.changeOriginalPixelSize(value);
        await inputFileListHeader.clickApplyAllButton();
      },
      expect: async (value: number) => {
        for (const inputFileItem of checkedInputFileItems) {
          await inputFileItem.expectScaleSizePercent(ScaleSizePercent.Default);
          await inputFileItem.expectOriginalPixelSize(value);
          await inputFileItem.expectScaleMode(ScaleMode.Smooth);
        }
        for (const inputFileItem of uncheckedInputFileItems) {
          await inputFileItem.expectScaleSizePercent(ScaleSizePercent.Default);
          await inputFileItem.expectOriginalPixelSize(
            OriginalPixelSize.Default,
          );
          await inputFileItem.expectScaleMode(ScaleMode.Smooth);
        }
      },
    });
  });

  test("should apply scale mode changes to all uploaded images via header controls", async ({
    page,
  }) => {
    const inputFileList = new InputFileList(page);
    const inputFileListHeader = new InputFileListHeader(page);
    const inputFileItems =
      await inputFileList.uploadAndGetItems(UploadItemPaths);

    for (const mode of Object.values(ScaleMode)) {
      await test.step(`apply scale mode to all images (${mode})`, async () => {
        await inputFileListHeader.changeScaleMode(mode);
        await inputFileListHeader.clickApplyAllButton();
        for (const inputFileItem of inputFileItems) {
          await inputFileItem.expectScaleMode(mode);
        }
      });
    }
  });

  test("should apply scale mode changes to all checked images via header controls", async ({
    page,
  }) => {
    const inputFileList = new InputFileList(page);
    const inputFileListHeader = new InputFileListHeader(page);
    const inputFileItems =
      await inputFileList.uploadAndGetItems(UploadItemPaths);
    // FIXME: randomly checked items
    const checkedInputFileItems = [
      ...inputFileItems.splice(1, 1),
      ...inputFileItems.splice(3, 2),
    ];
    const uncheckedInputFileItems = inputFileItems.filter(
      (inputFileItem) =>
        !checkedInputFileItems.some(
          (item) => item.fileName === inputFileItem.fileName,
        ),
    );
    await test.step("check images", async () => {
      for (const checkedInputFileItem of checkedInputFileItems) {
        await checkedInputFileItem.clickCheckBox();
      }
    });

    for (const mode of Object.values(ScaleMode)) {
      await test.step(`apply scale mode to all images (${mode})`, async () => {
        await inputFileListHeader.changeScaleMode(mode);
        await inputFileListHeader.clickApplyAllButton();
        for (const inputFileItem of checkedInputFileItems) {
          await inputFileItem.expectScaleSizePercent(ScaleSizePercent.Default);
          await inputFileItem.expectOriginalPixelSize(
            OriginalPixelSize.Default,
          );
          await inputFileItem.expectScaleMode(mode);
        }
        for (const inputFileItem of uncheckedInputFileItems) {
          await inputFileItem.expectScaleSizePercent(ScaleSizePercent.Default);
          await inputFileItem.expectOriginalPixelSize(
            OriginalPixelSize.Default,
          );
          await inputFileItem.expectScaleMode(ScaleMode.Smooth);
        }
      });
    }
  });
});
