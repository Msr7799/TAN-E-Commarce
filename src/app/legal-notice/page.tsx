"use client";

import ReactMarkdown from "react-markdown";
import { useTranslation } from "@/utils/i18n";

const legalContent: Record<"en" | "ar", { title: string; body: string }> = {
  en: {
    title: "Legal Notices & Disclaimers",
    body: `
## 1. Medical Disclaimer & Usage Guidelines

- Please read the listed product ingredients carefully before use to ensure there are no allergies to any of the compounds.
- We always recommend performing a **"patch test"** by trying the product on a very small area of the skin before using it fully.
- The store is not liable for any damages or adverse effects resulting from the misuse of the product or storing it in unsuitable conditions and environments after delivery.

## 2. Intellectual Property Rights

All content on this website, including images, logos, texts, and designs, is the exclusive property of Marbella Cosmetics. It is strictly prohibited to copy or use them for any commercial purposes without our prior written permission.

## 3. Shipping & Delivery Liability

The store is not responsible for any unforeseen delays caused by shipping companies, international customs procedures, or due to inaccurate address details provided by the customer.

## 4. Legal Binding for Cash on Delivery (COD)

When choosing the **"Cash on Delivery"** option, in the event of non-responsiveness with the delivery team or refusal to receive the shipment after dispatch, the customer is legally required to pay all delivery and return shipping fees incurred to and from the distribution hubs.
    `,
  },
  ar: {
    title: "الإشعارات القانونية وإخلاء المسؤولية",
    body: `
## 1. إخلاء المسؤولية الطبية وإرشادات الاستخدام

- يُرجى قراءة مكونات المنتج المدرجة بعناية قبل الاستخدام للتأكد من عدم وجود حساسية تجاه أي من المركبات.
- نوصي دائماً بإجراء **"اختبار البقعة"** بتجربة المنتج على منطقة صغيرة جداً من الجلد قبل استخدامه بشكل كامل.
- لا يتحمل المتجر أي مسؤولية عن الأضرار أو الآثار السلبية الناجمة عن سوء استخدام المنتج أو تخزينه في ظروف وبيئات غير مناسبة بعد التسليم.

## 2. حقوق الملكية الفكرية

جميع محتويات هذا الموقع، بما فيها الصور والشعارات والنصوص والتصاميم، هي ملك حصري لـ Marbella Cosmetics. يُحظر بشكل صارم نسخها أو استخدامها لأي أغراض تجارية دون إذن كتابي مسبق منا.

## 3. مسؤولية الشحن والتوصيل

لا يتحمل المتجر المسؤولية عن أي تأخيرات غير متوقعة تسببها شركات الشحن أو إجراءات الجمارك الدولية أو بسبب تفاصيل العنوان غير الدقيقة المقدمة من العميل.

## 4. الالتزام القانوني للدفع عند الاستلام (COD)

عند اختيار خيار **"الدفع عند الاستلام"**، وفي حال عدم الاستجابة مع فريق التوصيل أو رفض استلام الشحنة بعد إرسالها، يلتزم العميل قانونياً بدفع جميع رسوم التوصيل والإرجاع المتكبَّدة من وإلى مراكز التوزيع.
    `,
  },
};

export default function LegalNoticePage() {
  const { locale } = useTranslation();
  const lang = locale === "ar" ? "ar" : "en";
  const { title, body } = legalContent[lang];

  return (
    <main className="prose prose-slate dark:prose-invert mx-auto max-w-4xl px-4 py-16">
      <h1>{title}</h1>
      <ReactMarkdown>{body}</ReactMarkdown>
    </main>
  );
}
