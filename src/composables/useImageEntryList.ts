import { PSImageDataSettingType } from "@/@types/convert";
import useImageEntryStore from "@/stores/imageEntryStore";

/**
 * Composable for managing image entry lists
 * @param target - The target list: 'input' for imageEntryList, 'scaled' for scaledImageList
 */
const useImageEntryList = (target: "input" | "scaled") => {
  const store = useImageEntryStore();

  const addFileToImageEntryList = async (
    file: File,
    opts: { originalPixelSize: number } & PSImageDataSettingType,
  ) => {
    if (target !== "input") {
      throw new Error(
        "addFileToImageEntryList can only be used with 'input' target",
      );
    }
    await store.addInputImageEntry(file, opts);
  };

  const clearErrorsOneEntry = (uuid: string) => {
    if (target === "input") {
      store.clearInputImageEntryErrors(uuid);
    } else {
      store.clearScaledImageEntryErrors(uuid);
    }
  };

  const deleteOne = (uuid: string) => {
    if (target === "input") {
      store.removeImageEntry(uuid);
    } else {
      store.removeScaledImageEntry(uuid);
    }
  };

  const downloadOne = (uuid: string) => {
    if (target === "input") {
      store.downloadInputImageEntry(uuid);
    } else {
      store.downloadScaledImageEntry(uuid);
    }
  };

  const isImageEntryListEmpty = () => {
    return target === "input" ? store.isInputEmpty : store.isScaledEmpty;
  };

  return {
    addFileToImageEntryList,
    clearErrorsOneEntry,
    deleteOne,
    downloadOne,
    isImageEntryListEmpty,
  };
};

export default useImageEntryList;
