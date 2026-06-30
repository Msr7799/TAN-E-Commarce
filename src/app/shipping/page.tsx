"use client";

import ReactMarkdown from "react-markdown";
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

export default function ShippingPolicyPage() {
  const { locale } = useTranslation();
  const lang = locale === "ar" ? "ar" : "en";
  const { title, body } = shippingContent[lang];

  return (
    <main className="prose prose-slate dark:prose-invert mx-auto max-w-4xl px-4 py-16">
      <h1>{title}</h1>
      <ReactMarkdown>{body}</ReactMarkdown>
    </main>
  );
}
