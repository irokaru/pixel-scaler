import cn from "@/core/config/i18n/cn.json" with { type: "json" };
import en from "@/core/config/i18n/en.json" with { type: "json" };
import es from "@/core/config/i18n/es.json" with { type: "json" };
import ja from "@/core/config/i18n/ja.json" with { type: "json" };
import tr from "@/core/config/i18n/tr.json" with { type: "json" };

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
