/**
Returns the language code of the user's browser.
@returns The language code of the user's browser.
*/
export const getBrowserLanguage = (): string => {
  return (navigator.languages && navigator.languages[0]) || navigator.language;
};
