import { ImageEntry } from "@/@types/convert";
import { ScaleMode } from "@/constants/form";
import { PSImageData } from "@/models/InputImageData";

const defaultProps = { image: {}, settings: {}, errors: [] };

export const dummyImageEntry = async (
  props: {
    image?: Partial<ImageEntry["image"]>;
    settings?: Partial<ImageEntry["settings"]>;
    errors?: ImageEntry["errors"];
  } = defaultProps,
): Promise<ImageEntry> => {
  const imageData = await PSImageData.init(
    new File([], props.image?.data?.name ?? "image.png"),
  );
  return {
    image: { ...imageData.toObject(), ...props.image },
    settings: {
      scaleSizePercent: 100,
      scaleMode: ScaleMode.Smooth,
      ...props.settings,
    },
    errors: props.errors || [],
  };
};
