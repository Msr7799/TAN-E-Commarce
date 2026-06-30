"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { useTranslation } from "@/utils/i18n";

const refundContent: Record<"en" | "ar", { title: string; body: string }> = {
  en: {
    title: "Return and Exchange Policy",
    body: `
## Returns and Refunds
There are absolutely no returns or refunds for products, except in the single case where a product arrives damaged to the customer.

## Exchanges within Bahrain
Customers within the Kingdom of Bahrain may request an exchange if the product is in its original condition, sealed and unused.

## International Exchanges and Return Fees
If a customer outside Bahrain wishes to make an exchange, the customer shall bear the full cost of international shipping and return fees. International return shipping fees start from **BHD 12** for the base weight; final cost depends on actual weight and volume.
    `,
  },
  ar: {
    title: "سياسة الإرجاع والاستبدال",
    body: `
## الإرجاع والاسترداد
لا يوجد إرجاع أو استرداد للمنتجات بشكل مطلق، إلا في الحالة الوحيدة التي يصل فيها المنتج تالفاً إلى العميل.

## الاستبدال داخل البحرين
يحق للعملاء داخل مملكة البحرين طلب استبدال المنتج شريطة أن يكون في حالته الأصلية، مغلقاً وغير مستخدم.

## الاستبدال الدولي ورسوم الإرجاع
في حال رغب عميل خارج البحرين في إجراء استبدال، يتحمل العميل كامل تكاليف الشحن الدولي ورسوم الإرجاع. تبدأ رسوم شحن الإرجاع الدولي من **12 دينار بحريني** للوزن الأساسي؛ وقد تزيد التكلفة النهائية بناءً على الوزن الفعلي والحجم الإجمالي.
    `,
  },
};

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="mt-8 mb-3 text-xl font-bold text-slate-900 first:mt-0 dark:text-white">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>
  ),
  ul: ({ children }) => <ul className="mb-4 list-disc ps-5">{children}</ul>,
  li: ({ children }) => <li className="mb-1 text-slate-700 dark:text-slate-300">{children}</li>,
};

export default function RefundPolicyPage() {
  const { locale } = useTranslation();
  const lang = locale === "ar" ? "ar" : "en";
  const { title, body } = refundContent[lang];

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="relative mb-10 inline-block text-3xl font-bold text-slate-900 dark:text-white">
        {title}
        <span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-golden" />
      </h1>
      <ReactMarkdown components={markdownComponents}>{body}</ReactMarkdown>
    </main>
  );
}
