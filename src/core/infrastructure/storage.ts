/**
 * Sets the value of a key in the local storage.
 * @param key - The key to set.
 * @param value - The value to set for the key.
 */
export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

/**
 * Retrieves the value associated with the specified key from the local storage.
 * @param key - The key of the value to retrieve.
 * @returns The value associated with the specified key, or null if the key does not exist.
 */
export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

/**
 * Removes an item from the local storage based on the provided key.
 * @param key - The key of the item to be removed.
 */
export const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

/**
 * Checks if a value exists in the local storage.
 * @param key - The key to check in the local storage.
 * @returns A boolean indicating whether the value exists in the local storage.
 */
export const existsLocalStorage = (key: string) => {
  return localStorage.getItem(key) !== null;
};
