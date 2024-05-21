/**
 * Retrieves the version of the application.
 * @returns The version of the application as a string.
 */
export const getAppVersion = (): string => {
  return import.meta.env.VITE_APP_VERSION;
};

/**
 * Returns the language code of the user's browser.
 * @returns The language code of the user's browser.
 */
export const getBrowserLanguage = (): string => {
  return (
    (window.navigator.languages && window.navigator.languages[0]) ||
    window.navigator.language
  );
};

/**
 * Checks if the application is running in standalone mode.
 * @returns A boolean value indicating whether the application is running in standalone mode.
 */
export const isStandalone = (): boolean => {
  return (
    "VITE_IS_STANDALONE" in import.meta.env &&
    import.meta.env.VITE_IS_STANDALONE === "true"
  );
};

/**
 * Checks if the code is running in a web environment.
 * @returns {boolean} Returns true if the code is running in a web environment, false otherwise.
 */
export const isWeb = (): boolean => {
  return !isStandalone();
};

/**
 * Checks if the application is running in RPG Maker Unite mode.
 * @returns {boolean} Returns true if the application is running in RPG Maker Unite mode.
 */
export const isUnite = (): boolean => {
  return (
    "VITE_IS_UNITE" in import.meta.env &&
    import.meta.env.VITE_IS_UNITE === "true"
  );
};
