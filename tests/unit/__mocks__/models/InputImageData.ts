import { ScaleMode } from "@/constants/form";
import { createPSImageData } from "@/core/models/InputImageData";
import type { ImageEntry } from "@/types/convert";

const defaultProps = { image: {}, settings: {}, errors: [] };

export const dummyImageEntry = async (
  props: {
    image?: Partial<ImageEntry["image"]>;
    settings?: Partial<ImageEntry["settings"]>;
    errors?: ImageEntry["errors"];
  } = defaultProps,
): Promise<ImageEntry> => {
  const image = await createPSImageData(
    new File([], props.image?.data?.name ?? "image.png"),
  );
  return {
    image: { ...image, animated: false, ...props.image },
    settings: {
      scaleSizePercent: 100,
      scaleMode: ScaleMode.Smooth,
      ...props.settings,
    },
    errors: props.errors || [],
  };
};
