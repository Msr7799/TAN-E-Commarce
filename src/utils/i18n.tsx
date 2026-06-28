"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

// نوع البيانات الخاص بملفات الترجمة (القاموس)
type Messages = Record<string, any>;

// القواميس المتوفرة للغات
const LOCALES: Record<string, Messages> = { en, ar };

// واجهة القيم التي سيوفرها سياق الترجمة (Context)
interface I18nContextValue {
  locale: string;                                          // اللغة النشطة حالياً (en أو ar)
  setLocale: (l: string) => void;                          // دالة لتغيير اللغة
  t: (key: string, vars?: Record<string, any>) => string;  // دالة جلب النص المترجم
}

// إنشاء سياق الترجمة (Context) بقيمة افتراضية فارغة
const I18nContext = createContext<I18nContextValue | undefined>(undefined);

/**
 * مكون مزود اللغة (LanguageProvider) يغلف التطبيق بالكامل لإدارة حالة اللغات
 * وإدارة اتجاه الصفحة (RTL/LTR) والاحتفاظ باختيار المستخدم.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>("en");

  // مزامنة اللغة المفضلة المخزنة في localStorage بمجرد بدء تشغيل التطبيق في المتصفح
  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved === "en" || saved === "ar") {
      setLocaleState(saved);
    }
  }, []);

  // دالة لتحديث اللغة النشطة وحفظها في localStorage
  const setLocale = (newLocale: string) => {
    if (newLocale === "en" || newLocale === "ar") {
      setLocaleState(newLocale);
      localStorage.setItem("locale", newLocale);
    }
  };

  // مراقبة تغيير اللغة لتعديل سمة اتجاه الصفحة (dir) وكود اللغة (lang) في ملف الـ HTML الرئيسي
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  // جلب قاموس الكلمات النشط بناءً على اللغة المحددة
  const messages = useMemo(() => LOCALES[locale] ?? LOCALES.en, [locale]);

  /**
   * دالة الترجمة الرئيسية (t) لجلب النصوص المترجمة بناءً على مسار المفتاح (مثل "hero.title")
   * وتدعم استبدال المتغيرات الديناميكية (Interpolation) داخل النصوص.
   */
  const t = (key: string, vars?: Record<string, any>) => {
    const parts = key.split(".");
    let value: any = messages;
    
    // التغلغل في شجرة القاموس للوصول للمفتاح المطلوب
    for (const p of parts) {
      value = value?.[p];
      if (value === undefined) break;
    }
    
    // إذا لم يتم العثور على المفتاح، يتم إرجاع المفتاح نفسه كقيمة احتياطية لتفادي انهيار الواجهة
    if (value === undefined) return key;
    
    // معالجة المتغيرات وصيغ الجمع إن وجدت داخل النص المترجم
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

/**
 * خطاف مخصص (Custom Hook) لتسهيل استدعاء دالة الترجمة وتغيير اللغة داخل أي مكون (Component).
 */
export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
