import * as colorService from "../services/colorService";

export const getColorsSettings = () => {
  return colorService.colors;
};

export const getSettingColorKey = () => {
  return colorService.getColorKey();
};

export const getColorSettings = () => {
  return colorService.getColorSettings();
};

export const setColorSettings = (colorKey: string) => {
  return colorService.setColorKey(colorKey);
};
