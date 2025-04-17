import { Ref } from "vue";

import { ImageEntry, InputImageDataSettingType } from "@/@types/convert";
import { FileError } from "@/models/errors/FileError";
import { InputImageData, InputImageDataSetting } from "@/models/InputImageData";

const useImageEntryList = (imageEntryList: Ref<ImageEntry[]>) => {
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

  const deleteOneImageEntry = (index: number) => {
    URL.revokeObjectURL(imageEntryList.value[index].image.url);
    imageEntryList.value.splice(index, 1);
  };

  const isImageEntryListEmpty = () => {
    return imageEntryList.value.length === 0;
  };

  return {
    imageEntryList,
    pushFileToInputImageData,
    deleteOneImageEntry,
    isImageEntryListEmpty,
  };
};

export default useImageEntryList;
