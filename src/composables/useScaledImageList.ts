import { Ref } from "vue";

import { ImageCheckList, ScaledImage } from "@/@types/convert";
import {
  createZipBlobFromScaledImages,
  downloadBlob,
  downloadString,
} from "@/utils/fileUtils";

const useScaledImageList = (scaledImageList: Ref<ScaledImage[]>) => {
  const getTargetImages = (checkedMap: ImageCheckList): ScaledImage[] => {
    const allUnchecked = scaledImageList.value.every(
      (scaledImage) => !checkedMap[scaledImage.image.uuid],
    );

    if (allUnchecked) {
      return scaledImageList.value;
    }

    return scaledImageList.value.filter(
      (scaledImage) => checkedMap[scaledImage.image.uuid],
    );
  };

  const downloadOne = (index: number) => {
    const { image } = scaledImageList.value[index];
    downloadString(image.url, image.data.name);
  };

  const downloadAnyChecked = (checkedMap: ImageCheckList) => {
    const targetImages = getTargetImages(checkedMap);

    for (const { image } of targetImages) {
      downloadString(image.url, image.data.name);
    }
  };

  const downloadAnyCheckedZip = async (checkedMap: ImageCheckList) => {
    const targetImages = getTargetImages(checkedMap);
    const zipBlob = await createZipBlobFromScaledImages(targetImages);
    downloadBlob(zipBlob, "images.zip");
  };

  const deleteOne = (index: number) => {
    URL.revokeObjectURL(scaledImageList.value[index].image.url);
    scaledImageList.value.splice(index, 1);
  };

  const deleteAnyChecked = (checkedMap: ImageCheckList) => {
    const allUnchecked = scaledImageList.value.every(
      (scaledImage) => !checkedMap[scaledImage.image.uuid],
    );
    scaledImageList.value = scaledImageList.value.filter((entry) => {
      const isChecked = checkedMap[entry.image.uuid];
      if (allUnchecked || isChecked) {
        URL.revokeObjectURL(entry.image.url);
      }
      return !allUnchecked && !isChecked;
    });
  };

  const isScaledImageListEmpty = () => {
    return scaledImageList.value.length === 0;
  };

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
