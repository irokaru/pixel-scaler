import {
  existsLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "../core/infrastructure/storage";

const StorageKey = "color";

export const getDefaultColorKey = () => {
  if (!existsLocalStorage(StorageKey)) {
    return "light";
  }

  const key = getLocalStorage(StorageKey) ?? "";
  return existsColorKey(key) ? key : "light";
};

export const getDefaultColorValue = () => {
  const key = getDefaultColorKey();
  return key === "light" ? "white" : "black";
};

export const setColor = (key: string) => {
  if (existsColorKey(key)) {
    setLocalStorage(StorageKey, key);
  }
};

const existsColorKey = (key: string) => {
  return key === "light" || key === "dark";
};
