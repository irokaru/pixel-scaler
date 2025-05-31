import { ImageCheckList, ImageEntry } from "@/@types/convert";
import {
  downloadString,
  createZipBlobFromScaledImages,
  downloadBlob,
} from "@/utils/fileUtils";
import { getCheckedItems, isAllUnchecked } from "@/utils/imageItemUtils";
import { revokeObjectURL } from "@/utils/imageUtils";

const useImageEntryCheckedOperation = (imageEntryList: ImageEntry[]) => {
  const deleteAnyChecked = (checkedMap: ImageCheckList) => {
    const allUnchecked = isAllUnchecked(imageEntryList, checkedMap);

    return (imageEntryList = imageEntryList.filter((item) => {
      const isChecked = checkedMap[item.image.uuid];
      if (allUnchecked || isChecked) {
        revokeObjectURL(item.image.url);
      }
      return !allUnchecked && !isChecked;
    }));
  };

  const downloadAnyChecked = (
    checkedMap: ImageCheckList,
    outputPath: string,
  ) => {
    const targetImages = getCheckedItems(imageEntryList, checkedMap);

    for (const { image } of targetImages) {
      downloadString(image.url, image.data.name, outputPath);
    }
  };

  const downloadAnyCheckedZip = async (checkedMap: ImageCheckList) => {
    const targetImages = getCheckedItems(imageEntryList, checkedMap);
    const zipBlob = await createZipBlobFromScaledImages(targetImages);
    downloadBlob(zipBlob, "images.zip");
  };

  return {
    deleteAnyChecked,
    downloadAnyChecked,
    downloadAnyCheckedZip,
  };
};

export default useImageEntryCheckedOperation;
