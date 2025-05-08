import { Ref } from "vue";

import { ImageEntry, PSImageDataSettingType } from "@/@types/convert";
import { CustomErrorObject } from "@/@types/error";
import { CustomErrorBase } from "@/models/errors/_ErrorBase";
import { FileError } from "@/models/errors/FileError";
import { UnknownError } from "@/models/errors/UnknownError";
import { PSImageData, PSImageDataSetting } from "@/models/InputImageData";
import { downloadString } from "@/utils/fileUtils";
import { revokeObjectURL } from "@/utils/imageUtils";

const useImageEntryList = (
  imageEntryList: Ref<ImageEntry[]>,
  errors?: Ref<CustomErrorObject[]>,
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
      imageEntryList.value.push({
        image: inputImageData.toObject(),
        settings,
        errors: [],
      });
    } catch (error) {
      if (error instanceof CustomErrorBase) {
        errors?.value.push(error.toObject());
      } else {
        errors?.value.push(new UnknownError(error).toObject());
      }
    }
  };

  const clearErrorsOneEntry = (uuid: string) => {
    const entry = findOneByUuid(uuid);
    if (!entry) return;
    entry.errors = [];
  };

  const deleteOne = (uuid: string) => {
    const entry = findOneByUuid(uuid);
    if (!entry) return;
    revokeObjectURL(entry.image.url);
    imageEntryList.value = imageEntryList.value.filter(
      (entry) => entry.image.uuid !== uuid,
    );
  };

  const downloadOne = (uuid: string) => {
    const entry = findOneByUuid(uuid);
    if (!entry) return;
    downloadString(entry.image.url, entry.image.data.name);
  };

  const findOneByUuid = (uuid: string) =>
    imageEntryList.value.find((entry) => entry.image.uuid === uuid);
  const isImageEntryListEmpty = () => imageEntryList.value.length === 0;

  const isDuplicate = (url: string) => {
    return imageEntryList.value.some((entry) => entry.image.url === url);
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
