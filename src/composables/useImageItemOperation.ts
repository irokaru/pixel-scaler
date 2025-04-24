import { Ref } from "vue";

import { ImageCheckList, ImageEntry } from "@/@types/convert";

const useImageItemOperation = (items: Ref<ImageEntry[]>) => {
  const isAllUnchecked = (checkedMap: ImageCheckList) =>
    items.value.every((item) => !checkedMap[item.image.uuid]);

  const getCheckedItems = (checkedMap: ImageCheckList) => {
    return isAllUnchecked(checkedMap)
      ? items.value
      : items.value.filter((item) => checkedMap[item.image.uuid]);
  };

  return {
    isAllUnchecked,
    getCheckedItems,
  };
};

export default useImageItemOperation;
