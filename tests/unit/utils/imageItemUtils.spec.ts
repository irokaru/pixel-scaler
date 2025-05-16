import {
  ImageEntry,
  ImageCheckList,
  PSImageDataObject,
} from "@/@types/convert";
import { ScaleMode } from "@/constants/form";
import { isAllUnchecked, getCheckedItems } from "@/utils/imageItemUtils";

describe("imageCheckUtils", () => {
  // モック画像データ生成ヘルパー
  const createMockImage = (uuid: string): PSImageDataObject => ({
    uuid,
    data: new File(["dummy"], "dummy.png"),
    imageData: new ImageData(1, 1),
    width: 100,
    height: 100,
    originalPixelSize: 100,
    url: "http://example.com/dummy.png",
    status: "loaded",
  });

  const createMockImageEntry = (uuid: string): ImageEntry => ({
    image: createMockImage(uuid),
    settings: {
      scaleSizePercent: 100,
      scaleMode: ScaleMode.Smooth,
    },
    errors: [],
  });

  describe("isAllUnchecked", () => {
    const item1 = createMockImageEntry("1");
    const item2 = createMockImageEntry("2");
    const items = [item1, item2];

    test.each<{
      description: string;
      items: ImageEntry[];
      checkedMap: ImageCheckList;
      expected: boolean;
    }>([
      {
        description: "all unchecked → returns true",
        items,
        checkedMap: { "1": false, "2": false },
        expected: true,
      },
      {
        description: "one checked → returns false",
        items,
        checkedMap: { "1": false, "2": true },
        expected: false,
      },
      {
        description: "all checked → returns false",
        items,
        checkedMap: { "1": true, "2": true },
        expected: false,
      },
      {
        description: "empty items → returns true",
        items: [],
        checkedMap: {},
        expected: true,
      },
    ])("$description", ({ items, checkedMap, expected }) => {
      expect(isAllUnchecked(items, checkedMap)).toBe(expected);
    });
  });

  describe("getCheckedItems", () => {
    const item1 = createMockImageEntry("1");
    const item2 = createMockImageEntry("2");
    const items = [item1, item2];

    test.each<{
      description: string;
      items: ImageEntry[];
      checkedMap: ImageCheckList;
      expected: ImageEntry[];
    }>([
      {
        description: "all unchecked → returns all items",
        items,
        checkedMap: { "1": false, "2": false },
        expected: [item1, item2],
      },
      {
        description: "one checked (1) → returns [item1]",
        items,
        checkedMap: { "1": true, "2": false },
        expected: [item1],
      },
      {
        description: "one checked (2) → returns [item2]",
        items,
        checkedMap: { "1": false, "2": true },
        expected: [item2],
      },
      {
        description: "all checked → returns all items",
        items,
        checkedMap: { "1": true, "2": true },
        expected: [item1, item2],
      },
      {
        description: "empty items → returns empty array",
        items: [],
        checkedMap: {},
        expected: [],
      },
    ])("$description", ({ items, checkedMap, expected }) => {
      expect(getCheckedItems(items, checkedMap)).toEqual(expected);
    });
  });
});
