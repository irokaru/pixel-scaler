import { ImageCheckList } from "@/@types/convert";
import useImageEntryStore from "@/stores/imageEntryStore";

/**
 * Composable for batch operations on checked image entries
 * @param target - The target list: 'input' for imageEntryList, 'scaled' for scaledImageList
 */
const useImageEntryCheckedOperation = (target: "input" | "scaled") => {
  const store = useImageEntryStore();

  const deleteAnyChecked = (checkedMap: ImageCheckList) => {
    if (target === "input") {
      store.deleteCheckedInputEntries(checkedMap);
    } else {
      store.deleteCheckedScaledEntries(checkedMap);
    }
  };

  const downloadAnyChecked = (checkedMap: ImageCheckList) => {
    if (target === "input") {
      store.downloadCheckedInputEntries(checkedMap);
    } else {
      store.downloadCheckedScaledEntries(checkedMap);
    }
  };

  const downloadAnyCheckedZip = async (checkedMap: ImageCheckList) => {
    return target === "input"
      ? await store.downloadCheckedInputEntriesZip(checkedMap)
      : await store.downloadCheckedScaledEntriesZip(checkedMap);
  };

  return {
    deleteAnyChecked,
    downloadAnyChecked,
    downloadAnyCheckedZip,
  };
};

export default useImageEntryCheckedOperation;
