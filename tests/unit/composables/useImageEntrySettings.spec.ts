import { createPinia, setActivePinia } from "pinia";
import { ref } from "vue";

vi.mock("@/models/InputImageData");

import { ImageCheckList } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";
import useImageEntrySettings from "@/composables/useImageEntrySettings";
import { ScaleMode } from "@/constants/form";
import useImageEntryStore from "@/stores/imageEntryStore";

import { dummyImageEntry } from "../__mocks__/models/InputImageData";

describe("useImageEntrySettings", () => {
  let store: ReturnType<typeof useImageEntryStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    store = useImageEntryStore();
  });

  const expectSettingsToMatch = (
    index: number,
    expectedScaleSizePercent: number,
    expectedOriginalPixelSize: number,
    expectedScaleMode: ScaleModeType,
  ) => {
    expect(store.imageEntryList[index].settings.scaleSizePercent).toBe(
      expectedScaleSizePercent,
    );
    expect(store.imageEntryList[index].image.originalPixelSize).toBe(
      expectedOriginalPixelSize,
    );
    expect(store.imageEntryList[index].settings.scaleMode).toBe(
      expectedScaleMode,
    );
  };

  const expectSettingsToNotMatch = (
    index: number,
    unexpectedScaleSizePercent: number,
    unexpectedOriginalPixelSize: number,
    unexpectedScaleMode: ScaleModeType,
  ) => {
    expect(store.imageEntryList[index].settings.scaleSizePercent).not.toBe(
      unexpectedScaleSizePercent,
    );
    expect(store.imageEntryList[index].image.originalPixelSize).not.toBe(
      unexpectedOriginalPixelSize,
    );
    expect(store.imageEntryList[index].settings.scaleMode).not.toBe(
      unexpectedScaleMode,
    );
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
      // Add mock entries to store
      const mockEntries = await Promise.all([
        dummyImageEntry(),
        dummyImageEntry(),
        dummyImageEntry(),
      ]);
      store.imageEntryList.push(...mockEntries);

      const uuids = store.imageEntryList.map((e) => e.image.uuid);
      const checkedMapMock = ref<ImageCheckList>(checkedMap(uuids));

      const { applySettings } = useImageEntrySettings(checkedMapMock);

      applySettings(
        overrideValues.scaleSizePercent,
        overrideValues.originalPixelSize,
        overrideValues.scaleMode,
      );

      for (const [index] of store.imageEntryList.entries()) {
        const isExpectedToApply = expectedApplied.includes(index);
        const expectMethod = isExpectedToApply
          ? expectSettingsToMatch
          : expectSettingsToNotMatch;
        expectMethod(
          index,
          overrideValues.scaleSizePercent,
          overrideValues.originalPixelSize,
          overrideValues.scaleMode,
        );
      }
    },
  );
});
