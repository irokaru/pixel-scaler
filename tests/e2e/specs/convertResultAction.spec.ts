import path from "node:path";
import { fileURLToPath } from "node:url";

import { test, expect, Page } from "@playwright/test";

import {
  OriginalPixelSize,
  ResultDisplayStyles,
  ScaleMode,
  ScaleSizePercent,
} from "@/constants/form";

import { ConvertItem } from "../components/ConvertItem";
import { ConvertList } from "../components/Convertlist";
import { InputFileList } from "../components/InputFileList";
import { InputFileListHeader } from "../components/InputFileListHeader";

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
const DefaultParams = {
  scaleSizePercent: ScaleSizePercent.Default,
  originalPixelSize: OriginalPixelSize.Default,
  scaleMode: ScaleMode.Smooth,
};

test.describe("Single image convert result", () => {
  let convertItem: ConvertItem;
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const inputFileList = new InputFileList(page);
    const [inputFileItem] = await inputFileList.uploadAndGetItems([
      path.resolve(FixturePath, "1px.png"),
    ]);
    await inputFileItem.clickConvertButton();

    convertItem = new ConvertItem(
      page,
      path.basename(UploadItemPaths[0]),
      DefaultParams,
    );
  });

  test("should download a converted image", async ({ page }) => {
    await new ConvertList(page).exists();
    await convertItem.exists();

    await test.step("should click download button and download file", async () => {
      const downloadPromise = page.waitForEvent("download");
      await convertItem.clickDownloadButton();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe(convertItem.fileName);
    });
  });

  test("should delete a converted image", async ({ page }) => {
    const convertList = new ConvertList(page);
    await convertList.exists();
    await convertItem.exists();

    await test.step("should click delete button and delete item", async () => {
      await convertItem.clickDeleteButton();
      await convertItem.notExists();
      convertList.notExists();
    });
  });
});

test.describe("Multiple image convert result", () => {
  let convertItems: ConvertItem[];
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    const inputFileList = new InputFileList(page);
    await inputFileList.uploadImages(UploadItemPaths);
    await new InputFileListHeader(page).clickConvertAllButton();
    convertItems = UploadItemPaths.map((filePath) => {
      const fileName = path.basename(filePath);
      return new ConvertItem(page, fileName, DefaultParams);
    });
  });

  test("should download all converted images", async ({ page }) => {
    const convertList = new ConvertList(page);

    await test.step("should display convert list", async () => {
      for (const convertItem of convertItems) {
        await convertItem.exists();
      }
    });

    await test.step("should click download zip button and download zip file", async () => {
      const downloadPromise = page.waitForEvent("download");
      await convertList.clickDownloadZipButton();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe("images.zip");
    });

    await test.step("should click delete all button and delete all items", async () => {
      await convertList.clickDeleteAllButton();
      for (const convertItem of convertItems) {
        await convertItem.notExists();
      }
      await convertList.notExists();
    });
  });

  test("should download checked converted images", async ({ page }) => {
    const convertList = new ConvertList(page);

    await test.step("should display convert list", async () => {
      for (const convertItem of convertItems) {
        await convertItem.exists();
      }
    });

    // FIXME: randomly checked items
    const checkedConvertItems = [
      ...convertItems.slice(0, 2),
      ...convertItems.slice(3, 1),
    ];
    const uncheckedConvertItems = convertItems.filter(
      (item) =>
        !checkedConvertItems.some(
          (checkedItem) => checkedItem.fileName === item.fileName,
        ),
    );

    await test.step("should check convert items", async () => {
      for (const checkedConvertItem of checkedConvertItems) {
        await checkedConvertItem.clickCheckBox();
      }
    });

    await test.step("should click download zip button and download zip file", async () => {
      const downloadPromise = page.waitForEvent("download");
      await convertList.clickDownloadZipButton();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe("images.zip");
    });

    await test.step("should click delete selected button and delete checked items", async () => {
      await convertList.clickDeleteAllButton();
      for (const convertItem of checkedConvertItems) {
        await convertItem.notExists();
      }
      for (const convertItem of uncheckedConvertItems) {
        await convertItem.exists();
      }
      await convertList.exists();
    });
  });
});

test.describe("Convert list display style", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const convertAllOperation = async (page: Page) => {
    const inputFileList = new InputFileList(page);
    await inputFileList.uploadImages(UploadItemPaths);
    await new InputFileListHeader(page).clickConvertAllButton();
    return new ConvertList(page);
  };

  for (const style of Object.values(ResultDisplayStyles)) {
    test(`should select ${style} display style`, async ({ page }) => {
      await test.step(`change convert result style`, async () => {
        const convertList = await convertAllOperation(page);
        await convertList.exists();
        await convertList.selectDisplayStyle(style);
        await expect(
          convertList.convertList.locator(
            `.scaled-image-list__items--${style}`,
          ),
        ).toBeVisible();
      });

      await test.step(`should display style persist after reload`, async () => {
        await page.reload();
        const convertList = await convertAllOperation(page);
        await convertList.exists();
        await expect(
          convertList.convertList.locator(
            `.scaled-image-list__items--${style}`,
          ),
        ).toBeVisible();
      });
    });
  }
});
