import { Ref } from "vue";

import { ImageCheckList, InputImageDataObject } from "@/@types/convert";

const useImageItemOperation = <T extends { image: InputImageDataObject }>(
  items: Ref<T[]>,
) => {
  const deleteOneItem = (index: number) => {
    URL.revokeObjectURL(items.value[index].image.url);
    items.value.splice(index, 1);
  };

  const isAllUnchecked = (checkedMap: ImageCheckList) =>
    items.value.every((item) => !checkedMap[item.image.uuid]);

  const deleteAnyCheckedItems = (checkedMap: ImageCheckList) => {
    const allUnchecked = isAllUnchecked(checkedMap);

    items.value = items.value.filter((item) => {
      const isChecked = checkedMap[item.image.uuid];
      if (allUnchecked || isChecked) {
        URL.revokeObjectURL(item.image.url);
      }
      return !allUnchecked && !isChecked;
    });
  };

  const getCheckedItems = (checkedMap: ImageCheckList) => {
    const allUnchecked = isAllUnchecked(checkedMap);

    return allUnchecked
      ? items.value
      : items.value.filter((item) => checkedMap[item.image.uuid]);
  };

  const isListEmpty = () => items.value.length === 0;

  return {
    deleteOneItem,
    deleteAnyCheckedItems,
    getCheckedItems,
    isListEmpty,
  };
};

export default useImageItemOperation;
