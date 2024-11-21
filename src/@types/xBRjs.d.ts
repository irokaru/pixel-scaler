declare module "xbr-js/dist/xBRjs.esm.js" {
  /**
   * blendColors - Determines if new colors will be created. Defaults to true.
   * scaleAlpha - Determines whether to upscale the alpha channel using the xBR algorythm. Defaults to false.
   */
  type rawOpts = {
    blendColors?: boolean;
    scaleAlpha?: boolean;
  };

  /**
   * Applies 2x scaling using xBR algorithm.
   * @param pixelArray - The input pixels in ARGB format.
   * @param width - The width of the original image.
   * @param height - The height of the original image.
   * @param rawOpts - Optional parameters to customize the scaling behavior.
   * @returns A new Uint32Array containing the scaled image data.
   */
  export function xbr2x(
    pixelArray: Uint32Array,
    width: number,
    height: number,
    options?: rawOpts,
  ): Uint32Array;

  /**
   * Applies 3x scaling using xBR algorithm.
   * @param pixelArray - The input pixels in ARGB format.
   * @param width - The width of the original image.
   * @param height - The height of the original image.
   * @param rawOpts - Optional parameters to customize the scaling behavior.
   * @returns A new Uint32Array containing the scaled image data.
   */
  export function xbr3x(
    pixelArray: Uint32Array,
    width: number,
    height: number,
    options?: rawOpts,
  ): Uint32Array;

  /**
   * Applies 4x scaling using xBR algorithm.
   * @param pixelArray - The input pixels in ARGB format.
   * @param width - The width of the original image.
   * @param height - The height of the original image.
   * @param rawOpts - Optional parameters to customize the scaling behavior.
   * @returns A new Uint32Array containing the scaled image data.
   */
  export function xbr4x(
    pixelArray: Uint32Array,
    width: number,
    height: number,
    options?: rawOpts,
  ): Uint32Array;
}
