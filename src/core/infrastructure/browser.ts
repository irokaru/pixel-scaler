/**
 * Returns the language code of the user's browser.
 * @returns The language code of the user's browser.
 */
export const getBrowserLanguage = (): string => {
  return (
    (globalThis.navigator.languages && globalThis.navigator.languages[0]) ||
    globalThis.navigator.language
  );
};
