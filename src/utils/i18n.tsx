"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

type Messages = Record<string, any>;

const LOCALES: Record<string, Messages> = { en, ar };

interface I18nContextValue {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string, vars?: Record<string, any>) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>("en");

  // Keep locale in sync with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved === "en" || saved === "ar") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: string) => {
    if (newLocale === "en" || newLocale === "ar") {
      setLocaleState(newLocale);
      localStorage.setItem("locale", newLocale);
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const messages = useMemo(() => LOCALES[locale] ?? LOCALES.en, [locale]);

  const t = (key: string, vars?: Record<string, any>) => {
    const parts = key.split(".");
    let value: any = messages;
    for (const p of parts) {
      value = value?.[p];
      if (value === undefined) break;
    }
    if (value === undefined) return key;
    if (typeof value === "string" && vars) {
      return value.replace(/\{(\w+)\}/g, (_, k) => {
        const v = vars[k];
        if (k === "plural") return v && v > 1 ? "s" : "";
        return v ?? "";
      });
    }
    return String(value);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
