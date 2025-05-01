import { Ref } from "vue";

import { ImageEntry, PSImageDataSettingType } from "@/@types/convert";
import { PSCustomErrorObject } from "@/@types/error";
import { PSCustomError } from "@/models/errors/_ErrorBase";
import { FileError } from "@/models/errors/FileError";
import { PSImageData, PSImageDataSetting } from "@/models/InputImageData";
import { downloadString } from "@/utils/fileUtils";
import { revokeObjectURL } from "@/utils/imageUtils";

const useImageEntryList = (
  imageEntryList: Ref<ImageEntry[]>,
  errors: Ref<PSCustomErrorObject[]>,
) => {
  const addFileToImageEntryList = async (
    file: File,
    opts: { originalPixelSize: number } & PSImageDataSettingType,
  ) => {
    try {
      const inputImageData = await PSImageData.init(file);

      if (isDuplicate(inputImageData.toUrl())) {
        throw new FileError("duplicate-image", { filename: file.name });
      }

      inputImageData.originalPixelSize = opts.originalPixelSize;
      const settings = new PSImageDataSetting(opts);
      imageEntryList.value.push({ image: inputImageData.toObject(), settings });
    } catch (error) {
      if (error instanceof PSCustomError) {
        errors.value.push(error.toObject());
      } else {
        errors.value.push({
          key: "error.unknown",
          params: { message: JSON.stringify(error) },
          kind: "unknown",
        });
      }
    }
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

  const isDuplicate = (url: string) => {
    return imageEntryList.value.some((entry) => entry.image.url === url);
  };

  return {
    addFileToImageEntryList,
    deleteOne,
    downloadOne,
    isImageEntryListEmpty,
  };
};

export default useImageEntryList;
