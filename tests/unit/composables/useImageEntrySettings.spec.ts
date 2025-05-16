import { ref } from "vue";

import { ImageEntry, ImageCheckList } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";
import useImageEntrySettings from "@/composables/useImageEntrySettings";
import { ScaleMode } from "@/constants/form";

import { dummyImageEntry } from "../__mocks__/models/InputImageData";

vi.mock("@/models/InputImageData");

describe("useImageEntrySettings", () => {
  const expectSettingsToMatch = (
    entry: ImageEntry,
    expectedScaleSizePercent: number,
    expectedOriginalPixelSize: number,
    expectedScaleMode: ScaleModeType,
  ) => {
    expect(entry.settings.scaleSizePercent).toBe(expectedScaleSizePercent);
    expect(entry.image.originalPixelSize).toBe(expectedOriginalPixelSize);
    expect(entry.settings.scaleMode).toBe(expectedScaleMode);
  };

  const expectSettingsToNotMatch = (
    entry: ImageEntry,
    unexpectedScaleSizePercent: number,
    unexpectedOriginalPixelSize: number,
    unexpectedScaleMode: ScaleModeType,
  ) => {
    expect(entry.settings.scaleSizePercent).not.toBe(
      unexpectedScaleSizePercent,
    );
    expect(entry.image.originalPixelSize).not.toBe(unexpectedOriginalPixelSize);
    expect(entry.settings.scaleMode).not.toBe(unexpectedScaleMode);
  };

  const overrideValues = {
    scaleSizePercent: 1234,
    originalPixelSize: 999,
    scaleMode: ScaleMode.Nearest,
  };

  test.each<{
    description: string;
    checkedMap: (uuids: string[]) => ImageCheckList;
    expectedApplied: number[];
  }>([
    {
      description: "only the first entry is checked",
      checkedMap: (uuids: string[]) => ({
        [uuids[0]]: true,
        [uuids[1]]: false,
        [uuids[2]]: false,
      }),
      expectedApplied: [0],
    },
    {
      description: "only the second entry is checked",
      checkedMap: (uuids: string[]) => ({
        [uuids[0]]: false,
        [uuids[1]]: true,
        [uuids[2]]: false,
      }),
      expectedApplied: [1],
    },
    {
      description: "all entries are checked",
      checkedMap: (uuids: string[]) => ({
        [uuids[0]]: true,
        [uuids[1]]: true,
        [uuids[2]]: true,
      }),
      expectedApplied: [0, 1, 2],
    },
    {
      description: "none are checked (treated as all checked)",
      checkedMap: (uuids: string[]) => ({
        [uuids[0]]: false,
        [uuids[1]]: false,
        [uuids[2]]: false,
      }),
      expectedApplied: [0, 1, 2],
    },
  ])(
    "should apply settings correctly when $description",
    async ({ checkedMap, expectedApplied }) => {
      const imageEntryListMock = ref<ImageEntry[]>(
        await Promise.all([
          dummyImageEntry(),
          dummyImageEntry(),
          dummyImageEntry(),
        ]),
      );

      const uuids = imageEntryListMock.value.map((e) => e.image.uuid);
      const checkedMapMock = ref<ImageCheckList>(checkedMap(uuids));

      const { applySettings } = useImageEntrySettings(
        imageEntryListMock,
        checkedMapMock,
      );

      applySettings(
        overrideValues.scaleSizePercent,
        overrideValues.originalPixelSize,
        overrideValues.scaleMode,
      );

      for (const [index, entry] of imageEntryListMock.value.entries()) {
        const isExpectedToApply = expectedApplied.includes(index);
        const expectMethod = isExpectedToApply
          ? expectSettingsToMatch
          : expectSettingsToNotMatch;
        expectMethod(
          entry,
          overrideValues.scaleSizePercent,
          overrideValues.originalPixelSize,
          overrideValues.scaleMode,
        );
      }
    },
  );
});
