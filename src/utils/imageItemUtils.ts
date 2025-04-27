import { ImageCheckList, ImageEntry } from "@/@types/convert";

export const isAllUnchecked = (
  items: ImageEntry[],
  checkedMap: ImageCheckList,
) => items.every((item) => !checkedMap[item.image.uuid]);

export const getCheckedItems = (
  items: ImageEntry[],
  checkedMap: ImageCheckList,
) => {
  return isAllUnchecked(items, checkedMap)
    ? items
    : items.filter((item) => checkedMap[item.image.uuid]);
};
