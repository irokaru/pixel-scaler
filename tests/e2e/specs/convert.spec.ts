import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "@playwright/test";

import {
  OriginalPixelSize,
  ScaleMode,
  ScaleSizePercent,
} from "@/constants/form";

import { ConvertItem } from "../components/ConvertItem";
import { ConvertList } from "../components/Convertlist";
import { InputFileList } from "../components/InputFileList";
import { InputFileListHeader } from "../components/InputFileListHeader";
import { testConversion } from "../util/testUtils";

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

test.describe("Image Conversion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should convert an image and handles duplicate conversion error", async ({
    page,
  }) => {
    const inputFileList = new InputFileList(page);
    const [inputFileItem] =
      await inputFileList.uploadAndGetItems(UploadItemPaths);

    await test.step("convert image with default settings", async () => {
      await inputFileItem.clickConvertButton();
      await new ConvertList(page).exists();
    });

    const convertItem = new ConvertItem(
      page,
      path.basename(UploadItemPaths[0]),
      {
        scaleSizePercent: ScaleSizePercent.Default,
        originalPixelSize: OriginalPixelSize.Default,
        scaleMode: ScaleMode.Smooth,
      },
    );
    await test.step("display converted image in result list", async () => {
      await convertItem.exists();
    });

    await test.step("attempt duplicate conversion", async () => {
      await inputFileItem.clickConvertButton();
    });

    await test.step("display duplicate conversion error", async () => {
      await inputFileItem.expectVisibleError();
    });

    await test.step("show and clear error message", async () => {
      await inputFileItem.clickErrorShowButton();
      await inputFileItem.expectVisibleErrorList();
      await inputFileItem.expectContainMessageInErrorList("already exists");
      await inputFileItem.clickClearErrorButton();
      await inputFileItem.expectNotVisibleError();
      await inputFileItem.expectNotVisibleErrorList();
    });
  });

  test("should convert an image with various settings", async ({ page }) => {
    const inputFileList = new InputFileList(page);
    const [inputFileItem] =
      await inputFileList.uploadAndGetItems(UploadItemPaths);

    await testConversion({
      name: "image",
      convert: async (opts) => {
        await inputFileItem.changeScaleSizePercent(opts.scaleSizePercent);
        await inputFileItem.changeOriginalPixelSize(opts.originalPixelSize);
        await inputFileItem.changeScaleMode(opts.scaleMode);
        await inputFileItem.clickConvertButton();
      },
      verify: async (opts) => {
        await new ConvertItem(
          page,
          path.basename(inputFileItem.fileName),
          opts,
        ).exists();
      },
    });
  });

  test("should convert checked images with various settings", async ({
    page,
  }) => {
    const inputFileList = new InputFileList(page);
    const inputFileListHeader = new InputFileListHeader(page);
    const inputFileItems =
      await inputFileList.uploadAndGetItems(UploadItemPaths);
    // FIXME: randomly checked items
    const checkedInputFileItems = [
      ...inputFileItems.slice(0, 1),
      ...inputFileItems.slice(3, 5),
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

    await testConversion({
      name: "checked images",
      convert: async (opts) => {
        await inputFileListHeader.changeScaleSizePercent(opts.scaleSizePercent);
        await inputFileListHeader.changeOriginalPixelSize(
          opts.originalPixelSize,
        );
        await inputFileListHeader.changeScaleMode(opts.scaleMode);
        await inputFileListHeader.clickApplyAllButton();
        await inputFileListHeader.clickConvertAllButton();
      },
      verify: async (opts) => {
        for (const inputFileItem of checkedInputFileItems) {
          await new ConvertItem(
            page,
            path.basename(inputFileItem.fileName),
            opts,
          ).exists();
        }
        for (const inputFileItem of uncheckedInputFileItems) {
          await new ConvertItem(
            page,
            path.basename(inputFileItem.fileName),
            opts,
          ).notExists();
        }
      },
    });
  });

  test("should convert all images with various settings", async ({ page }) => {
    const inputFileList = new InputFileList(page);
    const inputFileListHeader = new InputFileListHeader(page);
    const inputFileItems =
      await inputFileList.uploadAndGetItems(UploadItemPaths);

    await testConversion({
      name: "all images",
      convert: async (opts) => {
        await inputFileListHeader.changeScaleSizePercent(opts.scaleSizePercent);
        await inputFileListHeader.changeOriginalPixelSize(
          opts.originalPixelSize,
        );
        await inputFileListHeader.changeScaleMode(opts.scaleMode);
        await inputFileListHeader.clickApplyAllButton();
        await inputFileListHeader.clickConvertAllButton();
      },
      verify: async (opts) => {
        for (const inputFileItem of inputFileItems) {
          await new ConvertItem(
            page,
            path.basename(inputFileItem.fileName),
            opts,
          ).exists();
        }
      },
    });
  });
});
