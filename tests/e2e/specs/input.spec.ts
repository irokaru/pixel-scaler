import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "@playwright/test";

import { InputFileItem } from "../components/InputFileItem";
import { InputFileList } from "../components/InputFileList";

const CurrentPath = path.dirname(fileURLToPath(import.meta.url));
const FixturePath = path.resolve(CurrentPath, "../../fixture");
const UploadItemPaths = [
  path.resolve(FixturePath, "1px.png"),
  path.resolve(FixturePath, "2px.png"),
];

test.describe("input tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should upload and display valid images", async ({ page }) => {
    const inputFileList = new InputFileList(page);

    await test.step("verify input file list is initially empty", async () => {
      await inputFileList.expectNotUploadedFile();
    });

    await test.step("upload valid images", async () => {
      await inputFileList.uploadImages(UploadItemPaths);
    });

    await test.step("verify uploaded images are displayed", async () => {
      await inputFileList.expectUploadedFilePresent();
      for (const filePath of UploadItemPaths) {
        await new InputFileItem(page, path.basename(filePath)).exists();
      }
    });
  });

  test("should show and clear error for invalid image", async ({ page }) => {
    const inputFileList = new InputFileList(page);

    await test.step("verify input file list is initially empty", async () => {
      await inputFileList.expectNotUploadedFile();
    });

    const uploadItemPaths = [path.resolve(FixturePath, "invalid.png")];

    await test.step("upload invalid image", async () => {
      await inputFileList.uploadImages(uploadItemPaths);
    });

    await test.step("verify error message for invalid image is shown", async () => {
      await inputFileList.expectNotUploadedFile();
      await inputFileList.expectVisibleInputError();
      await inputFileList.expectExistsInputErrorMessage(
        `(${path.basename(uploadItemPaths[0])})`,
      );
    });

    await test.step("delete error and verify error list is hidden", async () => {
      await inputFileList.clickDeleteAllFilesButton();
      await inputFileList.expectNotVisibleInputError();
    });
  });

  test("should delete uploaded images", async ({ page }) => {
    const inputFileList = new InputFileList(page);

    await test.step("verify input file list is initially empty", async () => {
      await inputFileList.expectNotUploadedFile();
    });

    await test.step("upload valid images", async () => {
      await inputFileList.uploadImages(UploadItemPaths);
    });

    await test.step("verify uploaded images are displayed", async () => {
      await inputFileList.expectUploadedFilePresent();
      for (const filePath of UploadItemPaths) {
        await new InputFileItem(page, path.basename(filePath)).exists();
      }
    });

    for (const filePath of UploadItemPaths) {
      await test.step(`delete uploaded image ${path.basename(filePath)}`, async () => {
        await new InputFileItem(
          page,
          path.basename(filePath),
        ).clickDeleteButton();
      });
    }

    await test.step("verify uploaded images are deleted", async () => {
      await inputFileList.expectNotUploadedFile();
      for (const filePath of UploadItemPaths) {
        await new InputFileItem(page, path.basename(filePath)).notExists();
      }
    });
  });
});
