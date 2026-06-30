"use client";

import ReactMarkdown from "react-markdown";
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

export default function RefundPolicyPage() {
  const { locale } = useTranslation();
  const lang = locale === "ar" ? "ar" : "en";
  const { title, body } = refundContent[lang];

  return (
    <main className="prose prose-slate dark:prose-invert mx-auto max-w-4xl px-4 py-16">
      <h1>{title}</h1>
      <ReactMarkdown>{body}</ReactMarkdown>
    </main>
  );
}
