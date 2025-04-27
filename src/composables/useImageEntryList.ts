import { Ref } from "vue";

import { ImageEntry, PSImageDataSettingType } from "@/@types/convert";
import { FileError } from "@/models/errors/FileError";
import { PSImageData, PSImageDataSetting } from "@/models/InputImageData";
import { downloadString } from "@/utils/fileUtils";
import { revokeObjectURL } from "@/utils/imageUtils";

const useImageEntryList = (imageEntryList: Ref<ImageEntry[]>) => {
  const addFileToImageEntryList = async (
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
    revokeObjectURL(imageEntryList.value[index].image.url);
    imageEntryList.value.splice(index, 1);
  };

  const downloadOne = (index: number) => {
    const { image } = imageEntryList.value[index];
    downloadString(image.url, image.data.name);
  };

  const isImageEntryListEmpty = () => imageEntryList.value.length === 0;

  return {
    addFileToImageEntryList,
    deleteOne,
    downloadOne,
    isImageEntryListEmpty,
  };
};

export default useImageEntryList;
