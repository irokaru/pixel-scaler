import { ScaleMode } from "@/constants/form";
import { createPSImageData } from "@/core/models/InputImageData";
import type { ImageEntry } from "@/types/convert";

const defaultProps = { image: {}, settings: {}, errors: [] };

export const dummyImageEntry = async (
  properties: {
    image?: Partial<ImageEntry["image"]>;
    settings?: Partial<ImageEntry["settings"]>;
    errors?: ImageEntry["errors"];
  } = defaultProps,
): Promise<ImageEntry> => {
  const image = await createPSImageData(
    new File([], properties.image?.data?.name ?? "image.png"),
  );
  return {
    image: { ...image, animated: false, ...properties.image },
    settings: {
      scaleSizePercent: 100,
      scaleMode: ScaleMode.Smooth,
      ...properties.settings,
    },
    errors: properties.errors || [],
  };
};
