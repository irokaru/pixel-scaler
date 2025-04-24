import { Ref } from "vue";

import { ImageCheckList, ScaledImage } from "@/@types/convert";
import {
  createZipBlobFromScaledImages,
  downloadBlob,
  downloadString,
} from "@/utils/fileUtils";

import useImageItemOperation from "./useImageItemOperation";

const useScaledImageList = (scaledImageList: Ref<ScaledImage[]>) => {
  const { deleteOneItem, deleteAnyCheckedItems, getCheckedItems, isListEmpty } =
    useImageItemOperation(scaledImageList);
  const downloadOne = (index: number) => {
    const { image } = scaledImageList.value[index];
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

  const deleteOne = (index: number) => deleteOneItem(index);

  const deleteAnyChecked = (checkedMap: ImageCheckList) =>
    deleteAnyCheckedItems(checkedMap);

  const isScaledImageListEmpty = () => isListEmpty();

  return {
    downloadOne,
    downloadAnyChecked,
    downloadAnyCheckedZip,
    deleteOne,
    deleteAnyChecked,
    isScaledImageListEmpty,
  };
};

export default useScaledImageList;
