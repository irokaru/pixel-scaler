import { ref } from "vue";

import { ImageEntry, InputImageDataSettingType } from "@/@types/convert";
import { ScaleModeType } from "@/@types/form";
import { FileError } from "@/models/errors/FileError";
import { InputImageData, InputImageDataSetting } from "@/models/InputImageData";

const useImageEntryList = () => {
  const imageEntryList = ref<ImageEntry[]>([]);

  const pushFileToInputImageData = async (
    file: File,
    opts: { originalPixelSize: number } & InputImageDataSettingType,
  ) => {
    const inputImageData = await InputImageData.init(file);

    if (
      imageEntryList.value
        .values()
        .some((entry) => entry.image.url === inputImageData.toUrl())
    ) {
      throw new FileError("duplicate-file", { filename: file.name });
    }

    inputImageData.originalPixelSize = opts.originalPixelSize;
    const settings = new InputImageDataSetting(opts);
    imageEntryList.value.push({ image: inputImageData.toObject(), settings });
  };

  const deleteOneImageEntry = (index: number) => {
    imageEntryList.value.splice(index, 1);
  };

  const isImageEntryListEmpty = () => {
    return imageEntryList.value.length === 0;
  };

  const applySettingsToImageEntryList = (
    scaleSizePercent: number,
    originalPixelSize: number,
    scaleMode: ScaleModeType,
  ) => {
    if (isImageEntryListEmpty()) return;

    const isEvery = imageEntryList.value.every(
      (entry) => !entry.settings.checked,
    );
    const targetEntries = imageEntryList.value.filter(
      (entry) => isEvery || entry.settings.checked,
    );

    for (const entry of targetEntries) {
      entry.settings.scaleSizePercent = scaleSizePercent;
      entry.image.originalPixelSize = originalPixelSize;
      entry.settings.scaleMode = scaleMode;
    }
  };
  return {
    imageEntryList,
    pushFileToInputImageData,
    deleteOneImageEntry,
    isImageEntryListEmpty,
    applySettingsToImageEntryList,
  };
};

export default useImageEntryList;
