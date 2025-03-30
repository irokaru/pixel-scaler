import { xbr2x, xbr3x, xbr4x } from "xbr-js/dist/xBRjs.esm.js";

import { InputImageDataObject } from "@/@types/convert";
import { ScaleError } from "@/models/errors/ScaleError";
import { InputImageData } from "@/models/InputImageData";
import { resizeImageData, imageDataToFile } from "@/utils/imageUtils";

const XbrMaxPercent = 400;

/**
 * Scales an input image using the xBR algorithm and returns the resized image data.
 *
 * @param inputImageData - The input image data object containing the image to be scaled.
 * @param scaleSizePercent - The scaling percentage to apply to the image.
 * @returns A promise that resolves to the resized image data object.
 * @throws {ScaleError} If the input image size is invalid.
 */
export const xBR = async (
  inputImageData: InputImageDataObject,
  scaleSizePercent: number,
): Promise<InputImageData> => {
  if (!validateImageSize(inputImageData)) {
    throw new ScaleError("invalid-image-size", {
      originalPixelSize: inputImageData.originalPixelSize,
    });
  }

  const originalPixelSize = inputImageData.originalPixelSize;
  const orgSizeImageData = await resizeToOriginalPixelSize(
    inputImageData,
    originalPixelSize,
  );

  const uArray = new Uint32Array(orgSizeImageData.data.buffer);
  const { scaledUArray, scaledWidthByRatio, scaledHeightByRatio } = scaleImage(
    uArray,
    orgSizeImageData,
    originalPixelSize,
    scaleSizePercent,
  );

  const adjustedImageData = await adjustImageData(
    scaledUArray,
    scaledWidthByRatio,
    scaledHeightByRatio,
    orgSizeImageData,
    scaleSizePercent,
    originalPixelSize,
  );
  const adjustedFile = await imageDataToFile(
    adjustedImageData,
    inputImageData.data.name,
    inputImageData.data.type,
  );

  return await createResizedInputImageData(adjustedFile, originalPixelSize);
};

const resizeToOriginalPixelSize = async (
  inputImageData: InputImageDataObject,
  originalPixelSize: number,
) => {
  return await resizeImageData(
    inputImageData.imageData,
    inputImageData.width / originalPixelSize,
    inputImageData.height / originalPixelSize,
    true,
  );
};

const scaleImage = (
  uArray: Uint32Array,
  orgSizeImageData: ImageData,
  originalPixelSize: number,
  scaleSizePercent: number,
) => {
  let scaledWidthByRatio = structuredClone(orgSizeImageData.width);
  let scaledHeightByRatio = structuredClone(orgSizeImageData.height);

  const scaledUArray = calcScalePercents(
    originalPixelSize * scaleSizePercent,
  ).reduce((uint, percent) => {
    const normalizedScalePercent = normalizeScalePercent(percent);
    const xBR = getXbrFunction(normalizedScalePercent);
    const result = xBR(uint, scaledWidthByRatio, scaledHeightByRatio);

    scaledWidthByRatio *= normalizedScalePercent;
    scaledHeightByRatio *= normalizedScalePercent;

    return result;
  }, uArray);

  return { scaledUArray, scaledWidthByRatio, scaledHeightByRatio };
};

const adjustImageData = async (
  scaledUArray: Uint32Array,
  scaledWidthByRatio: number,
  scaledHeightByRatio: number,
  orgSizeImageData: ImageData,
  scaleSizePercent: number,
  originalPixelSize: number,
) => {
  const scaledImageData = new ImageData(
    new Uint8ClampedArray(scaledUArray.buffer),
    scaledWidthByRatio,
    scaledHeightByRatio,
  );

  const scaledWidth =
    (orgSizeImageData.width * scaleSizePercent * originalPixelSize) / 100;
  const scaledHeight =
    (orgSizeImageData.height * scaleSizePercent * originalPixelSize) / 100;

  return await resizeImageData(
    scaledImageData,
    scaledWidth,
    scaledHeight,
    true,
  );
};

const createResizedInputImageData = async (
  adjustedFile: File,
  originalPixelSize: number,
) => {
  const resizedInputImageData = await InputImageData.init(adjustedFile);
  resizedInputImageData.originalPixelSize = originalPixelSize;
  return resizedInputImageData;
};

const normalizeScalePercent = (scaleSizePercent: number) => {
  return scaleSizePercent < 200 ? 2 : Math.ceil(scaleSizePercent / 100);
};

const getXbrFunction = (normalizedScalePercent: number) => {
  const functions: {
    [key: number]: (
      pixelArray: Uint32Array,
      width: number,
      height: number,
    ) => Uint32Array;
  } = {
    2: xbr2x,
    3: xbr3x,
    4: xbr4x,
  };

  if (!(normalizedScalePercent in functions)) {
    throw new ScaleError("unsupported-scale-size", {
      scaleSizePercent: normalizedScalePercent,
    });
  }

  return functions[normalizedScalePercent];
};

const calcScalePercents = (scaleSizePercent: number, max = XbrMaxPercent) => {
  if (scaleSizePercent <= max) return [scaleSizePercent];

  scaleSizePercent /= 100;
  max /= 100;

  const scaleSizePercents = [max];
  const scaleSizePercentDivided = scaleSizePercent / max;

  if (scaleSizePercentDivided <= max) {
    scaleSizePercents.push(scaleSizePercentDivided);
  }

  if (max < scaleSizePercentDivided) {
    scaleSizePercents.push(
      ...calcScalePercents(
        Math.floor(scaleSizePercentDivided * 100),
        max * 100,
      ).map((p) => (p /= 100)),
    );
  }

  return scaleSizePercents.map((per) => per * 100);
};

/**
 * Validates if the dimensions of the input image are multiples of the original pixel size.
 *
 * @param inputImageData - The input image data containing width, height, and original pixel size.
 * @returns `true` if both the width and height of the image are multiples of the original pixel size, otherwise `false`.
 */
const validateImageSize = (inputImageData: InputImageDataObject) => {
  const widthMod = inputImageData.width % inputImageData.originalPixelSize;
  const heightMod = inputImageData.height % inputImageData.originalPixelSize;

  return widthMod === 0 && heightMod === 0;
};
