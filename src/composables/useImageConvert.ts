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
import { vueI18n } from "@/core/plugins/i18n";
import { ScaleError } from "@/models/errors/ScaleError";
import { UnknownError } from "@/models/errors/UnknownError";
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

  const convertOneByUuid = async (uuid: string): Promise<void> => {
    const entry = imageEntryList.value.find(
      (entry) => entry.image.uuid === uuid,
    );
    if (!entry) return;
    return await convertOne(entry);
  };

  const convertOne = async (entry: ImageEntry): Promise<void> => {
    const { image, settings } = entry;

    try {
      if (isDuplicate(entry)) {
        throw new ScaleError("duplicate-image-and-settings", {
          filename: image.data.name,
          scaleSizePercent: settings.scaleSizePercent,
          // FIXME: reflected to selected language when modify i18n
          scaleMode: vueI18n.global.t(`form.scale-modes.${settings.scaleMode}`),
        });
      }

      const scaledFile = await scaleMethods[settings.scaleMode](
        image,
        settings.scaleSizePercent,
      );

      const result: ImageEntry = {
        image: scaledFile.toObject(),
        settings,
        errors: [],
      };
      result.image.status = "scaled";

      scaledImageList.value.push(result);
    } catch (error) {
      // NOTE: scale methods throw ScaleError
      if (error instanceof ScaleError) {
        entry.errors.push(error.toObject());
      } else {
        errors.value.push(new UnknownError(JSON.stringify(error)).toObject());
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
    convertOneByUuid,
    convertOne,
  };
};

export default useImageConvert;
