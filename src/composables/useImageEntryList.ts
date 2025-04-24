import { Ref } from "vue";

import {
  ImageCheckList,
  ImageEntry,
  InputImageDataSettingType,
} from "@/@types/convert";
import { FileError } from "@/models/errors/FileError";
import { InputImageData, InputImageDataSetting } from "@/models/InputImageData";

import useImageItemOperation from "./useImageItemOperation";

const useImageEntryList = (imageEntryList: Ref<ImageEntry[]>) => {
  const { deleteOneItem, deleteAnyCheckedItems, isListEmpty } =
    useImageItemOperation(imageEntryList);

  const pushFileToInputImageData = async (
    file: File,
    opts: { originalPixelSize: number } & InputImageDataSettingType,
  ) => {
    const inputImageData = await InputImageData.init(file);

    if (
      imageEntryList.value.some(
        (entry) => entry.image.url === inputImageData.toUrl(),
      )
    ) {
      throw new FileError("duplicate-file", { filename: file.name });
    }

    inputImageData.originalPixelSize = opts.originalPixelSize;
    const settings = new InputImageDataSetting(opts);
    imageEntryList.value.push({ image: inputImageData.toObject(), settings });
  };

  const deleteCheckedImageEntries = (checkedMap: ImageCheckList) =>
    deleteAnyCheckedItems(checkedMap);

  const deleteOneImageEntry = (index: number) => deleteOneItem(index);

  const isImageEntryListEmpty = () => isListEmpty();

  return {
    pushFileToInputImageData,
    deleteCheckedImageEntries,
    deleteOneImageEntry,
    isImageEntryListEmpty,
  };
};

export default useImageEntryList;
