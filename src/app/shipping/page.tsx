"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { useTranslation } from "@/utils/i18n";

const shippingContent: Record<"en" | "ar", { title: string; body: string }> = {
  en: {
    title: "Shipping and Delivery Policy",
    body: `
## Delivery within the Kingdom of Bahrain
Orders are delivered within **24 to 72 hours**.

## International Shipping
Orders are shipped and delivered within **2 to 4 business days** (under normal shipping conditions).

## Delays & Liability
The store is not responsible for any unforeseen delays caused by shipping companies, international customs procedures, or due to inaccurate address details provided by the customer.

## Non-Responsiveness Delivery Policy (COD)
In the event of non-responsiveness with the delivery team or refusal to receive the shipment after it has been dispatched, the customer will be required to pay the delivery costs from the distribution hubs, plus the return shipping fees from the customer's address back to the distribution hubs.
    `,
  },
  ar: {
    title: "سياسة الشحن والتوصيل",
    body: `
## التوصيل داخل مملكة البحرين
يتم توصيل الطلبات خلال **24 إلى 72 ساعة**.

## الشحن الدولي
يتم شحن الطلبات وتسليمها خلال **2 إلى 4 أيام عمل** (في ظل ظروف الشحن الاعتيادية).

## التأخيرات والمسؤولية
لا يتحمل المتجر المسؤولية عن أي تأخيرات غير متوقعة تسببها شركات الشحن أو إجراءات الجمارك الدولية أو بسبب تفاصيل العنوان غير الدقيقة المقدمة من العميل.

## سياسة عدم الاستجابة عند التوصيل (الدفع عند الاستلام)
في حال عدم الاستجابة مع فريق التوصيل أو رفض استلام الشحنة بعد إرسالها، سيُطلب من العميل دفع تكاليف التوصيل من مراكز التوزيع، بالإضافة إلى رسوم شحن الإرجاع من عنوان العميل إلى مراكز التوزيع.
    `,
  },
};

// خرائط تنسيق صريحة لعناصر الماركداون (لا تعتمد على إضافة typography)
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

export default function ShippingPolicyPage() {
  const { locale } = useTranslation();
  const lang = locale === "ar" ? "ar" : "en";
  const { title, body } = shippingContent[lang];

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
