import cn from "@/core/config/i18n/cn.json";
import en from "@/core/config/i18n/en.json";
import es from "@/core/config/i18n/es.json";
import ja from "@/core/config/i18n/ja.json";
import tr from "@/core/config/i18n/tr.json";

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
