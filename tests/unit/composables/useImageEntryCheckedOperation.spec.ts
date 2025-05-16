import { ImageCheckList, ImageEntry } from "@/@types/convert";
import useImageEntryCheckedOperation from "@/composables/useImageEntryCheckedOperation";
import * as fileUtils from "@/utils/fileUtils";
import * as imageUtils from "@/utils/imageUtils";

import { dummyImageEntry } from "../__mocks__/models/InputImageData";

vi.mock("@/models/InputImageData");
const downloadBlobMock = vi.spyOn(fileUtils, "downloadBlob");
const revokeObjectURLMock = vi.spyOn(imageUtils, "revokeObjectURL");
const downloadStringMock = vi.spyOn(fileUtils, "downloadString");
const createZipBlobFromScaledImagesMock = vi.spyOn(
  fileUtils,
  "createZipBlobFromScaledImages",
);

describe("useImageEntryCheckedOperation", async () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockImageEntryList: ImageEntry[] = await Promise.all([
    dummyImageEntry(),
    dummyImageEntry(),
    dummyImageEntry(),
  ]);

  describe("deleteAnyChecked", async () => {
    test.each<{
      description: string;
      checkList: ImageCheckList;
      expectedCalledRevoke: string[];
      expectedReturns: ImageEntry[];
    }>([
      {
        description: "delete checked items",
        checkList: {
          [mockImageEntryList[0].image.uuid]: true,
          [mockImageEntryList[1].image.uuid]: false,
          [mockImageEntryList[2].image.uuid]: false,
        },
        expectedCalledRevoke: [mockImageEntryList[0].image.url],
        expectedReturns: [mockImageEntryList[1], mockImageEntryList[2]],
      },
      {
        description: "delete all when all unchecked",
        checkList: {
          [mockImageEntryList[0].image.uuid]: false,
          [mockImageEntryList[1].image.uuid]: false,
          [mockImageEntryList[2].image.uuid]: false,
        },
        expectedCalledRevoke: [
          mockImageEntryList[0].image.url,
          mockImageEntryList[1].image.url,
          mockImageEntryList[2].image.url,
        ],
        expectedReturns: [],
      },
      {
        description: "delete all when all checked",
        checkList: {
          [mockImageEntryList[0].image.uuid]: true,
          [mockImageEntryList[1].image.uuid]: true,
          [mockImageEntryList[2].image.uuid]: true,
        },
        expectedCalledRevoke: [
          mockImageEntryList[0].image.url,
          mockImageEntryList[1].image.url,
          mockImageEntryList[2].image.url,
        ],
        expectedReturns: [],
      },
    ])(
      "$description",
      async ({ checkList, expectedCalledRevoke, expectedReturns }) => {
        const { deleteAnyChecked } =
          useImageEntryCheckedOperation(mockImageEntryList);
        const deletedEntryList = deleteAnyChecked(checkList);

        expect(revokeObjectURLMock.mock.calls).toHaveLength(
          expectedCalledRevoke.length,
        );
        expect(revokeObjectURLMock.mock.calls).toEqual(
          expectedCalledRevoke.map((url) => [url]),
        );
        expect(deletedEntryList).toEqual(expectedReturns);
      },
    );
  });

  describe("downloadAnyChecked", async () => {
    const { downloadAnyChecked } =
      useImageEntryCheckedOperation(mockImageEntryList);

    test.each<{
      description: string;
      checkList: ImageCheckList;
      expectedCalledDownload: [string, string][];
    }>([
      {
        description: "download checked items",
        checkList: {
          [mockImageEntryList[0].image.uuid]: true,
          [mockImageEntryList[1].image.uuid]: false,
          [mockImageEntryList[2].image.uuid]: false,
        },
        expectedCalledDownload: [
          [
            mockImageEntryList[0].image.url,
            mockImageEntryList[0].image.data.name,
          ],
        ],
      },
      {
        description: "download all when all unchecked",
        checkList: {
          [mockImageEntryList[0].image.uuid]: false,
          [mockImageEntryList[1].image.uuid]: false,
          [mockImageEntryList[2].image.uuid]: false,
        },
        expectedCalledDownload: [
          [
            mockImageEntryList[0].image.url,
            mockImageEntryList[0].image.data.name,
          ],
          [
            mockImageEntryList[1].image.url,
            mockImageEntryList[1].image.data.name,
          ],
          [
            mockImageEntryList[2].image.url,
            mockImageEntryList[2].image.data.name,
          ],
        ],
      },
      {
        description: "download all when all checked",
        checkList: {
          [mockImageEntryList[0].image.uuid]: true,
          [mockImageEntryList[1].image.uuid]: true,
          [mockImageEntryList[2].image.uuid]: true,
        },
        expectedCalledDownload: [
          [
            mockImageEntryList[0].image.url,
            mockImageEntryList[0].image.data.name,
          ],
          [
            mockImageEntryList[1].image.url,
            mockImageEntryList[1].image.data.name,
          ],
          [
            mockImageEntryList[2].image.url,
            mockImageEntryList[2].image.data.name,
          ],
        ],
      },
    ])("$description", async ({ checkList, expectedCalledDownload }) => {
      downloadAnyChecked(checkList);

      expect(downloadStringMock.mock.calls).toHaveLength(
        expectedCalledDownload.length,
      );
      expect(downloadStringMock.mock.calls).toEqual(expectedCalledDownload);
    });
  });

  describe("downloadAnyCheckedZip", () => {
    createZipBlobFromScaledImagesMock.mockResolvedValue(new Blob());

    test.each<{
      description: string;
      checkList: ImageCheckList;
      expectedCalledCreatedZip: ImageEntry[];
    }>([
      {
        description: "download checked items",
        checkList: {
          [mockImageEntryList[0].image.uuid]: true,
          [mockImageEntryList[1].image.uuid]: false,
          [mockImageEntryList[2].image.uuid]: false,
        },
        expectedCalledCreatedZip: [mockImageEntryList[0]],
      },
      {
        description: "download all when all unchecked",
        checkList: {
          [mockImageEntryList[0].image.uuid]: false,
          [mockImageEntryList[1].image.uuid]: false,
          [mockImageEntryList[2].image.uuid]: false,
        },
        expectedCalledCreatedZip: [
          mockImageEntryList[0],
          mockImageEntryList[1],
          mockImageEntryList[2],
        ],
      },
      {
        description: "download all when all checked",
        checkList: {
          [mockImageEntryList[0].image.uuid]: true,
          [mockImageEntryList[1].image.uuid]: true,
          [mockImageEntryList[2].image.uuid]: true,
        },
        expectedCalledCreatedZip: [
          mockImageEntryList[0],
          mockImageEntryList[1],
          mockImageEntryList[2],
        ],
      },
    ])("$description", async ({ checkList, expectedCalledCreatedZip }) => {
      const { downloadAnyCheckedZip } =
        useImageEntryCheckedOperation(mockImageEntryList);
      await downloadAnyCheckedZip(checkList);

      expect(createZipBlobFromScaledImagesMock.mock.calls).toHaveLength(1);
      expect(createZipBlobFromScaledImagesMock.mock.calls[0]).toEqual([
        expectedCalledCreatedZip,
      ]);
      expect(downloadBlobMock.mock.calls).toHaveLength(1);
      expect(downloadBlobMock.mock.calls[0]).toEqual([
        expect.any(Blob),
        "images.zip",
      ]);
    });
  });
});
