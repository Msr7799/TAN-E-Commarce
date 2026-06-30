"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { useTranslation } from "@/utils/i18n";

const termsContent: Record<"en" | "ar", { title: string; intro: string; body: string }> = {
  en: {
    title: "Terms of Service and Website Policies",
    intro:
      "Welcome to the Marbella Cosmetics store. By browsing or purchasing from this website, you agree to comply with and be bound by the following terms and conditions:",
    body: `
## 1. Available Payment Options

We offer various secure payment methods, including:

- Credit cards and debit cards
- Apple Pay
- Cash on Delivery *(available within the Kingdom of Bahrain only)*

## 2. Shipping and Delivery

- **Delivery within the Kingdom of Bahrain:** Orders are delivered within 24 to 72 hours.
- **International Shipping:** Orders are shipped and delivered within 2 to 4 business days (under normal shipping conditions).
- The store is not responsible for any unforeseen delays caused by shipping companies, international customs procedures, or due to inaccurate address details provided by the customer.

## 3. Return and Exchange Policy

Due to the nature of our products relating to health and personal care, and to ensure public safety, please read the following terms carefully:

- **Returns and Refunds:** There are absolutely no returns or refunds for products, except in the single case where a product arrives damaged to the customer.
- **Exchanges within Bahrain:** Customers within the Kingdom of Bahrain are permitted to request a product exchange subject to general conditions (the product must be in its original condition, completely sealed, the security wrap or packaging unopened, and unused).
- **International Exchanges and Shipping (Outside Bahrain):**
  - If a customer outside Bahrain wishes to make an exchange, the customer shall bear the full cost of international shipping and return fees.
  - International return shipping fees start from **BHD 12** for the base weight. The final cost is subject to increase based on the actual weight and total volume of the products, according to the rates of the approved shipping company.

## 4. Disclaimer and Usage Guidelines

- Please read the listed product ingredients carefully before use to ensure there are no allergies to any of the compounds.
- We always recommend performing a **"patch test"** by trying the product on a very small area of the skin before using it fully.
- The store is not liable for any damages or adverse effects resulting from the misuse of the product or storing it in unsuitable conditions and environments after delivery.

## 5. Intellectual Property Rights

All content on this website, including images, logos, texts, and designs, is the exclusive property of Marbella Cosmetics. It is strictly prohibited to copy or use them for any commercial purposes without our prior written permission.

## 6. Cash on Delivery (COD) and Non-Responsiveness Policy

When choosing the **"Cash on Delivery"** option (whether the order was placed via the website or through our other channels), and the product is shipped and dispatched to your address; please note that in the event of non-responsiveness with the delivery team or refusal to receive the shipment after it has been dispatched, the customer will be required to pay the delivery costs from the distribution hubs, plus the return shipping fees from the customer's address back to the distribution hubs.
    `,
  },
  ar: {
    title: "شروط الخدمة وسياسات الموقع",
    intro:
      "مرحباً بك في متجر Marbella Cosmetics. بتصفحك أو شرائك من هذا الموقع، فإنك توافق على الالتزام بالشروط والأحكام التالية:",
    body: `
## 1. خيارات الدفع المتاحة

نوفر طرق دفع آمنة متعددة، تشمل:

- بطاقات الائتمان والخصم
- Apple Pay
- الدفع عند الاستلام *(متاح داخل مملكة البحرين فقط)*

## 2. الشحن والتوصيل

- **التوصيل داخل مملكة البحرين:** يتم توصيل الطلبات خلال 24 إلى 72 ساعة.
- **الشحن الدولي:** يتم شحن الطلبات وتسليمها خلال 2 إلى 4 أيام عمل (في ظل ظروف الشحن الاعتيادية).
- لا يتحمل المتجر المسؤولية عن أي تأخيرات غير متوقعة تسببها شركات الشحن أو إجراءات الجمارك الدولية أو بسبب تفاصيل العنوان غير الدقيقة المقدمة من العميل.

## 3. سياسة الإرجاع والاستبدال

نظراً لطبيعة منتجاتنا المتعلقة بالصحة والعناية الشخصية، وضماناً للسلامة العامة، يُرجى قراءة الشروط التالية بعناية:

- **الإرجاع والاسترداد:** لا يوجد إرجاع أو استرداد للمنتجات بشكل مطلق، إلا في الحالة الوحيدة التي يصل فيها المنتج تالفاً إلى العميل.
- **الاستبدال داخل البحرين:** يحق للعملاء داخل مملكة البحرين طلب استبدال المنتج وفق الشروط العامة (يجب أن يكون المنتج في حالته الأصلية، مغلقاً تماماً، ولم يُفتح غلافه الأمني، وغير مستخدم).
- **الاستبدال الدولي والشحن (خارج البحرين):**
  - في حال رغب عميل خارج البحرين في إجراء استبدال، يتحمل العميل كامل تكاليف الشحن الدولي ورسوم الإرجاع.
  - تبدأ رسوم شحن الإرجاع الدولي من **12 دينار بحريني** للوزن الأساسي، وقد تزيد التكلفة النهائية بناءً على الوزن الفعلي والحجم الإجمالي، وفق أسعار شركة الشحن المعتمدة.

## 4. إخلاء المسؤولية وإرشادات الاستخدام

- يُرجى قراءة مكونات المنتج المدرجة بعناية قبل الاستخدام للتأكد من عدم وجود حساسية تجاه أي من المركبات.
- نوصي دائماً بإجراء **"اختبار البقعة"** بتجربة المنتج على منطقة صغيرة جداً من الجلد قبل استخدامه بشكل كامل.
- لا يتحمل المتجر أي مسؤولية عن الأضرار أو الآثار السلبية الناجمة عن سوء استخدام المنتج أو تخزينه في ظروف وبيئات غير مناسبة بعد التسليم.

## 5. حقوق الملكية الفكرية

جميع محتويات هذا الموقع، بما فيها الصور والشعارات والنصوص والتصاميم، هي ملك حصري لـ Marbella Cosmetics. يُحظر بشكل صارم نسخها أو استخدامها لأي أغراض تجارية دون إذن كتابي مسبق منا.

## 6. الدفع عند الاستلام وسياسة عدم الاستجابة

عند اختيار خيار **"الدفع عند الاستلام"** (سواء تم تقديم الطلب عبر الموقع أو من خلال قنواتنا الأخرى)، وتم شحن المنتج وإرساله إلى عنوانك؛ يُرجى العلم أنه في حال عدم الاستجابة مع فريق التوصيل أو رفض استلام الشحنة بعد إرسالها، سيُطلب من العميل دفع تكاليف التوصيل من مراكز التوزيع، بالإضافة إلى رسوم شحن الإرجاع من عنوان العميل إلى مراكز التوزيع.
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
  em: ({ children }) => <em className="text-slate-600 italic dark:text-slate-400">{children}</em>,
  ul: ({ children }) => <ul className="mb-4 list-disc ps-5">{children}</ul>,
  li: ({ children }) => <li className="mb-1 text-slate-700 dark:text-slate-300">{children}</li>,
};

export default function TermsPage() {
  const { locale } = useTranslation();
  const lang = locale === "ar" ? "ar" : "en";
  const { title, intro, body } = termsContent[lang];

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="relative mb-10 inline-block text-3xl font-bold text-slate-900 dark:text-white">
        {title}
        <span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-golden" />
      </h1>
      <p className="mb-8 leading-relaxed text-slate-700 dark:text-slate-300">{intro}</p>
      <ReactMarkdown components={markdownComponents}>{body}</ReactMarkdown>
    </main>
  );
}
