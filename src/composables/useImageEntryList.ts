import { Ref } from "vue";

import {
  ImageCheckList,
  ImageEntry,
  PSImageDataSettingType,
} from "@/@types/convert";
import { FileError } from "@/models/errors/FileError";
import { PSImageData, PSImageDataSetting } from "@/models/InputImageData";
import {
  downloadString,
  createZipBlobFromScaledImages,
  downloadBlob,
} from "@/utils/fileUtils";

import useImageItemOperation from "./useImageItemOperation";

const useImageEntryList = (imageEntryList: Ref<ImageEntry[]>) => {
  const { isAllUnchecked, getCheckedItems } =
    useImageItemOperation(imageEntryList);

  const pushFileToInputImageData = async (
    file: File,
    opts: { originalPixelSize: number } & PSImageDataSettingType,
  ) => {
    const inputImageData = await PSImageData.init(file);

    if (
      imageEntryList.value.some(
        (entry) => entry.image.url === inputImageData.toUrl(),
      )
    ) {
      throw new FileError("duplicate-file", { filename: file.name });
    }

    inputImageData.originalPixelSize = opts.originalPixelSize;
    const settings = new PSImageDataSetting(opts);
    imageEntryList.value.push({ image: inputImageData.toObject(), settings });
  };

  const deleteOne = (index: number) => {
    URL.revokeObjectURL(imageEntryList.value[index].image.url);
    imageEntryList.value.splice(index, 1);
  };

  const deleteAnyChecked = (checkedMap: ImageCheckList) => {
    const allUnchecked = isAllUnchecked(checkedMap);

    imageEntryList.value = imageEntryList.value.filter((item) => {
      const isChecked = checkedMap[item.image.uuid];
      if (allUnchecked || isChecked) {
        URL.revokeObjectURL(item.image.url);
      }
      return !allUnchecked && !isChecked;
    });
  };

  const downloadOne = (index: number) => {
    const { image } = imageEntryList.value[index];
    downloadString(image.url, image.data.name);
  };

  const downloadAnyChecked = (checkedMap: ImageCheckList) => {
    const targetImages = getCheckedItems(checkedMap);

    for (const { image } of targetImages) {
      downloadString(image.url, image.data.name);
    }
  };

  const downloadAnyCheckedZip = async (checkedMap: ImageCheckList) => {
    const targetImages = getCheckedItems(checkedMap);
    const zipBlob = await createZipBlobFromScaledImages(targetImages);
    downloadBlob(zipBlob, "images.zip");
  };

  const isImageEntryListEmpty = () => imageEntryList.value.length === 0;

  return {
    pushFileToInputImageData,
    deleteOne,
    deleteAnyChecked,
    downloadOne,
    downloadAnyChecked,
    downloadAnyCheckedZip,
    isImageEntryListEmpty,
  };
};

export default useImageEntryList;
