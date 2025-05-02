import { Ref } from "vue";

import {
  ImageEntry,
  PSImageDataObject,
  ImageCheckList,
} from "@/@types/convert";
import { CustomErrorObject } from "@/@types/error";
import { ScaleModeType } from "@/@types/form";
import { nearestNeighbor, xBR } from "@/algorithm";
import { ScaleMode } from "@/constants/form";
import { CustomErrorBase } from "@/models/errors/_ErrorBase";
import { ScaleError } from "@/models/errors/ScaleError";
import { PSImageData } from "@/models/InputImageData";
import { getCheckedItems } from "@/utils/imageItemUtils";

type ScaleMethod = (
  file: PSImageDataObject,
  scaleSizePercent: number,
) => Promise<PSImageData>;

const scaleMethods: Record<ScaleModeType, ScaleMethod> = {
  [ScaleMode.Smooth]: xBR,
  [ScaleMode.Nearest]: nearestNeighbor,
};

const useImageConvert = (
  imageEntryList: Ref<ImageEntry[]>,
  scaledImageList: Ref<ImageEntry[]>,
  errors: Ref<CustomErrorObject[]>,
) => {
  const convertAnyChecked = async (checkedMap: ImageCheckList) => {
    const targets = getCheckedItems(imageEntryList.value, checkedMap);

    for (const entry of targets) {
      await convertOne(entry);
    }
  };

  const convertOneByIndex = async (entryIndex: number): Promise<void> => {
    const entry = imageEntryList.value[entryIndex];
    return await convertOne(entry);
  };

  const convertOne = async (entry: ImageEntry): Promise<void> => {
    const { image, settings } = entry;

    try {
      if (isDuplicate(entry)) {
        throw new ScaleError("duplicate-image-and-settings", {
          scaleSizePercent: settings.scaleSizePercent,
          scaleMode: settings.scaleMode,
        });
      }

      const scaledFile = await scaleMethods[settings.scaleMode](
        image,
        settings.scaleSizePercent,
      );

      const result: ImageEntry = {
        image: scaledFile.toObject(),
        settings,
      };
      result.image.status = "scaled";

      scaledImageList.value.push(result);
    } catch (error) {
      if (error instanceof CustomErrorBase) {
        errors.value.push(error.toObject());
      } else {
        errors.value.push({
          code: "error.unknown",
          params: { message: JSON.stringify(error) },
          kind: "unknown",
        });
      }
    }
  };

  const isDuplicate = (entry: ImageEntry): boolean => {
    return scaledImageList.value.some(
      (scaledImage) =>
        scaledImage.image.data.name === entry.image.data.name &&
        scaledImage.settings.scaleSizePercent ===
          entry.settings.scaleSizePercent &&
        scaledImage.image.originalPixelSize === entry.image.originalPixelSize &&
        scaledImage.settings.scaleMode === entry.settings.scaleMode,
    );
  };

  return {
    convertAnyChecked,
    convertOneByIndex,
    convertOne,
  };
};

export default useImageConvert;
