import cn from "./cn.json" with { type: "json" };
import en from "./en.json" with { type: "json" };
import es from "./es.json" with { type: "json" };
import ja from "./ja.json" with { type: "json" };
import tr from "./tr.json" with { type: "json" };

export const StorageKey = "language";
export const DefaultLanguage = "en";

export const Languages = {
  ja,
  en,
  cn,
  es,
  tr,
} as const;

export const LanguagesForUnite = {
  ja,
  en,
  cn,
} as const;
