import { ref, nextTick, Ref } from "vue";

import type { PSImageDataObject, ImageCheckList } from "@/@types/convert";
import useImageCheckable from "@/composables/useImageCheckable";

describe("useImageCheckable", () => {
  let modelValue: Ref<{ image: PSImageDataObject }[]>;

  const createImageDataObject = (uuid: string): PSImageDataObject => ({
    uuid,
    data: new File([""], "test.png"),
    imageData: new ImageData(1, 1),
    width: 100,
    height: 100,
    originalPixelSize: 100,
    url: "http://example.com/test.png",
    status: "loaded",
  });

  beforeEach(() => {
    modelValue = ref([
      { image: createImageDataObject("1") },
      { image: createImageDataObject("2") },
    ]);
  });

  test("initializes checkedMap with all items set to false", () => {
    const { checkedMap } = useImageCheckable(modelValue);

    expect(checkedMap.value).toEqual<ImageCheckList>({
      "1": false,
      "2": false,
    });
  });

  test("sets allChecked to true and updates checkedMap accordingly", async () => {
    const { allChecked, checkedMap } = useImageCheckable(modelValue);

    allChecked.value = true;
    await nextTick();

    expect(allChecked.value).toBe(true);
    expect(checkedMap.value).toEqual<ImageCheckList>({
      "1": true,
      "2": true,
    });
  });

  test("toggleAllChecked toggles checked state for all items", async () => {
    const { toggleAllChecked, allChecked, checkedMap } =
      useImageCheckable(modelValue);

    toggleAllChecked();
    await nextTick();

    expect(allChecked.value).toBe(true);
    expect(checkedMap.value).toEqual<ImageCheckList>({
      "1": true,
      "2": true,
    });

    toggleAllChecked();
    await nextTick();

    expect(allChecked.value).toBe(false);
    expect(checkedMap.value).toEqual<ImageCheckList>({
      "1": false,
      "2": false,
    });
  });

  test.each<{
    name: string;
    initialChecked: ImageCheckList;
    expectedIsAnyChecked: boolean;
  }>([
    {
      name: "isAnyChecked returns false when none are checked",
      initialChecked: { "1": false, "2": false },
      expectedIsAnyChecked: false,
    },
    {
      name: "isAnyChecked returns true when at least one is checked",
      initialChecked: { "1": true, "2": false },
      expectedIsAnyChecked: true,
    },
    {
      name: "isAnyChecked returns true when all are checked",
      initialChecked: { "1": true, "2": true },
      expectedIsAnyChecked: true,
    },
  ])("$name", async ({ initialChecked, expectedIsAnyChecked }) => {
    const { checkedMap, isAnyChecked } = useImageCheckable(modelValue);

    checkedMap.value = { ...initialChecked };
    await nextTick();

    expect(isAnyChecked.value).toBe(expectedIsAnyChecked);
  });

  test("updates checkedMap when modelValue changes (add and remove)", async () => {
    const { checkedMap } = useImageCheckable(modelValue);

    expect(checkedMap.value).toEqual<ImageCheckList>({
      "1": false,
      "2": false,
    });

    modelValue.value.push({
      image: createImageDataObject("3"),
    });
    await nextTick();
    expect(checkedMap.value).toEqual<ImageCheckList>({
      "1": false,
      "2": false,
      "3": false,
    });

    // Remove item
    modelValue.value = modelValue.value.filter(
      (item) => item.image.uuid !== "2",
    );
    await nextTick();
    expect(checkedMap.value).toEqual<ImageCheckList>({
      "1": false,
      "3": false,
    });
  });
});
