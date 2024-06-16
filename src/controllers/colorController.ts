import * as colorService from "@/services/colorService";

export const getColorSettingsList = () => {
  return colorService.colors;
};

export const getColorSettingKey = () => {
  return colorService.getColorKey();
};

export const getColorSettings = () => {
  return colorService.getColorSettings();
};

export const setColorSettingKey = (colorKey: string) => {
  return colorService.setColorKey(colorKey);
};
