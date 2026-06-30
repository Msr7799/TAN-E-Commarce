"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { useTranslation } from "@/utils/i18n";

// ─── محتوى سياسة الخصوصية بالعربية والإنجليزية ────────────────────────────

const privacyContent: Record<"en" | "ar", { title: string; lastUpdated: string; body: string }> = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: June 9, 2026",
    body: `
This Privacy Policy describes how Marbella Cosmetics (the "Site", "we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or make a purchase from marbellacosmetics.com (the "Site") or otherwise communicate with us regarding the Site (collectively, the "Services"). For purposes of this Privacy Policy, "you" and "your" means you as the user of the Services, whether you are a customer, website visitor, or another individual whose information we have collected pursuant to this Privacy Policy.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time, including to reflect changes to our practices or for other operational, legal, or regulatory reasons. We will post the revised Privacy Policy on the Site, update the "Last updated" date and take any other steps required by applicable law.

## How We Collect and Use Your Personal Information

To provide the Services, we collect personal information about you from a variety of sources. The information that we collect and use varies depending on how you interact with us.

### What Personal Information We Collect

The types of personal information we obtain about you depends on how you interact with our Site and use our Services. When we use the term "personal information", we are referring to information that identifies, relates to, describes or can be associated with you. The following sections describe the categories and specific types of personal information we collect.

#### Information We Collect Directly from You

Information that you directly submit to us through our Services may include:

- **Contact details** including your name, address, phone number, and email.
- **Order information** including your name, billing address, shipping address, payment confirmation, email address, and phone number.
- **Account information** including your username, password, security questions and other information used for account security purposes.
- **Customer support information** including the information you choose to include in communications with us.

#### Information We Collect about Your Usage

We may also automatically collect certain information about your interaction with the Services ("Usage Data"). To do this, we may use cookies, pixels and similar technologies ("Cookies"). Usage Data may include information about how you access and use our Site and your account, including device information, browser information, information about your network connection, your IP address and other information regarding your interaction with the Services.

#### Information We Obtain from Third Parties

We may obtain information about you from third parties, including from vendors and service providers who may collect information on our behalf, such as companies who support our Site and Services (e.g., Shopify), our payment processors, and analytics or advertising partners.

## How We Use Your Personal Information

- **Providing Products and Services:** We use your personal information to provide you with the Services in order to perform our contract with you, including to process your payments, fulfill your orders, send notifications related to your account, purchases, returns, or other transactions, and to manage your account.
- **Marketing and Advertising:** We may use your personal information for marketing and promotional purposes, such as to send marketing communications or to show you advertisements for products or services.
- **Security and Fraud Prevention:** We use your personal information to detect, investigate or take action regarding possible fraudulent, illegal or malicious activity.
- **Communicating with You and Service Improvement:** We use your personal information to provide customer support and improve our Services.

## Cookies

Like many websites, we use Cookies on our Site. For specific information about the Cookies that we use related to powering our store with Shopify, see [https://www.shopify.com/legal/cookies](https://www.shopify.com/legal/cookies). We use Cookies to remember your actions and preferences, run analytics, and tailor advertising. Most browsers accept Cookies by default, but you can change your browser settings to remove or reject Cookies.

## How We Disclose Personal Information

In certain circumstances, we may disclose your personal information to third parties for contract fulfillment purposes, legitimate purposes and other reasons subject to this Privacy Policy, including:

- With vendors or other third parties who perform services on our behalf (e.g., IT management, payment processing, data analytics, customer support, cloud storage, fulfillment and shipping).
- With business and marketing partners to provide services and advertise to you.
- With our affiliates or within our corporate group.
- In connection with a business transaction such as a merger or bankruptcy, or to comply with legal obligations.

We do not use or disclose sensitive personal information without your consent.

## Categories of Personal Information and Recipients

We may disclose the following categories of personal information to recipients as described above:

- Identifiers such as contact details and certain order/account information.
- Commercial information such as order information and shopping information.
- Internet or similar network activity such as Usage Data.
- Geolocation data such as locations determined by IP address.

## Third Party Websites and Links

Our Site may provide links to websites or other online platforms operated by third parties. If you follow links to sites not affiliated with us, please review their privacy policies. We do not guarantee or assume responsibility for the privacy practices of such third-party sites.

## Children's Data

The Services are not intended for children, and we do not knowingly collect personal information from children. If you are a parent or guardian and believe your child provided us with personal information, please contact us to request deletion.

## Security and Retention of Your Information

No security measures are perfect. We implement reasonable safeguards to protect personal information but cannot guarantee absolute security. Retention periods vary depending on business needs and legal obligations.

## Your Rights

Depending on where you live, you may have rights to access, delete, correct, or port your personal information, restrict processing, withdraw consent, and appeal decisions. You may also manage communication preferences and opt out of promotional emails.

- **Right to Access / Know:** Request access to personal information we hold about you.
- **Right to Delete:** Request deletion of your personal information.
- **Right to Correct:** Request correction of inaccurate information.
- **Right of Portability:** Request a copy of your personal information for transfer.
- **Restriction of Processing:** Request limitation of processing in certain situations.
- **Withdrawal of Consent:** Withdraw consent where processing is based on consent.

## Complaints

If you have complaints about how we process your personal information, contact us using the details below. If you are not satisfied with our response, depending on your jurisdiction you may have the right to lodge a complaint with your local data protection authority.

## International Users

We may transfer, store and process your personal information outside the country you live in. Where applicable, we rely on recognized transfer mechanisms such as the European Commission's Standard Contractual Clauses when transferring data from the EU.

## Contact

Should you have questions about our privacy practices or wish to exercise any rights, please contact us at [6464ssq@gmail.com](mailto:6464ssq@gmail.com) or by mail at: Hamad Town, 408-1206-1212, 00000, BH.
    `,
  },

  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: 9 يونيو 2026",
    body: `
تصف سياسة الخصوصية هذه كيفية قيام Marbella Cosmetics (المشار إليها بـ "الموقع" أو "نحن" أو "لنا") بجمع معلوماتك الشخصية واستخدامها والكشف عنها عند زيارتك أو استخدامك لخدماتنا أو إجرائك أي عملية شراء من marbellacosmetics.com أو عند تواصلك معنا بأي طريقة أخرى تتعلق بالموقع (يشار إليها مجتمعةً بـ "الخدمات"). لأغراض سياسة الخصوصية هذه، يعني "أنت" و"الخاص بك" المستخدم للخدمات، سواء كنت عميلاً أو زائراً للموقع أو أي شخص آخر جمعنا معلوماته وفقاً لهذه السياسة.

## التغييرات على سياسة الخصوصية

قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر، بما في ذلك لتعكس التغييرات التي تطرأ على ممارساتنا أو لأسباب تشغيلية أو قانونية أو تنظيمية أخرى. سننشر سياسة الخصوصية المعدّلة على الموقع، ونحدّث تاريخ "آخر تحديث"، ونتخذ أي خطوات أخرى تقتضيها القوانين المعمول بها.

## كيف نجمع معلوماتك الشخصية ونستخدمها

لتوفير الخدمات، نجمع معلوماتك الشخصية من مصادر متعددة. تتفاوت المعلومات التي نجمعها ونستخدمها بحسب طريقة تفاعلك معنا.

### ما هي المعلومات الشخصية التي نجمعها

تتوقف أنواع المعلومات الشخصية التي نحصل عليها على طريقة تفاعلك مع موقعنا واستخدامك لخدماتنا. عندما نستخدم مصطلح "المعلومات الشخصية"، فإننا نقصد المعلومات التي تُعرّفك أو ترتبط بك أو تصفك أو يمكن ربطها بك. تصف الأقسام التالية الفئات والأنواع المحددة للمعلومات الشخصية التي نجمعها.

#### المعلومات التي نجمعها منك مباشرةً

قد تتضمن المعلومات التي تقدمها إلينا مباشرةً عبر خدماتنا ما يلي:

- **بيانات الاتصال** بما فيها اسمك وعنوانك ورقم هاتفك وبريدك الإلكتروني.
- **معلومات الطلب** بما فيها اسمك وعنوان الفواتير وعنوان الشحن وتأكيد الدفع وعنوان بريدك الإلكتروني ورقم هاتفك.
- **معلومات الحساب** بما فيها اسم المستخدم وكلمة المرور وأسئلة الأمان وغيرها من المعلومات المستخدمة لأغراض أمان الحساب.
- **معلومات دعم العملاء** بما فيها المعلومات التي تختار تضمينها في مراسلاتك معنا.

#### المعلومات التي نجمعها حول استخدامك

قد نجمع أيضاً بصورة تلقائية معلومات معينة حول تفاعلك مع الخدمات ("بيانات الاستخدام"). لتحقيق ذلك، قد نستخدم ملفات تعريف الارتباط والبكسل وتقنيات مماثلة ("الكوكيز"). قد تشمل بيانات الاستخدام معلومات حول كيفية وصولك إلى موقعنا وحسابك واستخدامك لهما، بما في ذلك معلومات الجهاز والمتصفح ومعلومات اتصال الشبكة وعنوان IP الخاص بك وغيرها من المعلومات المتعلقة بتفاعلك مع الخدمات.

#### المعلومات التي نحصل عليها من أطراف ثالثة

قد نحصل على معلومات تخصك من أطراف ثالثة، بما فيها الموردون ومزودو الخدمات الذين قد يجمعون معلومات نيابةً عنا، كالشركات الداعمة لموقعنا وخدماتنا (مثل Shopify) ومعالجو المدفوعات ومزودو خدمات التحليلات والإعلانات.

## كيف نستخدم معلوماتك الشخصية

- **تقديم المنتجات والخدمات:** نستخدم معلوماتك الشخصية لتزويدك بالخدمات تنفيذاً لعقدنا معك، بما في ذلك معالجة مدفوعاتك وتنفيذ طلباتك وإرسال الإشعارات المتعلقة بحسابك وعمليات الشراء والمرتجعات وسائر المعاملات، وإدارة حسابك.
- **التسويق والإعلان:** قد نستخدم معلوماتك الشخصية لأغراض تسويقية وترويجية، كإرسال رسائل تسويقية أو عرض إعلانات المنتجات والخدمات عليك.
- **الأمان ومنع الاحتيال:** نستخدم معلوماتك الشخصية للكشف عن الأنشطة الاحتيالية أو غير القانونية أو الضارة المحتملة والتحقيق فيها واتخاذ الإجراءات اللازمة بشأنها.
- **التواصل معك وتحسين الخدمة:** نستخدم معلوماتك الشخصية لتقديم دعم العملاء وتحسين خدماتنا.

## ملفات تعريف الارتباط (الكوكيز)

مثل كثير من المواقع الإلكترونية، نستخدم الكوكيز على موقعنا. للاطلاع على معلومات تفصيلية حول الكوكيز التي نستخدمها فيما يتعلق بتشغيل متجرنا عبر Shopify، يُرجى زيارة [https://www.shopify.com/legal/cookies](https://www.shopify.com/legal/cookies). نستخدم الكوكيز لتذكُّر إجراءاتك وتفضيلاتك، وتشغيل التحليلات، وتخصيص الإعلانات. تقبل معظم المتصفحات الكوكيز افتراضياً، غير أنه يمكنك تعديل إعدادات متصفحك لإزالتها أو رفضها.

## كيف نكشف عن المعلومات الشخصية

في ظروف معينة، قد نكشف عن معلوماتك الشخصية لأطراف ثالثة لأغراض تنفيذ العقد أو لأغراض مشروعة أو لأسباب أخرى وفقاً لسياسة الخصوصية هذه، بما في ذلك:

- مع الموردين أو أطراف ثالثة أخرى تؤدي خدمات نيابةً عنا (مثل إدارة تقنية المعلومات ومعالجة المدفوعات وتحليل البيانات ودعم العملاء والتخزين السحابي والوفاء بالطلبات والشحن).
- مع شركاء الأعمال والتسويق لتقديم الخدمات والإعلان لك.
- مع الشركات التابعة لنا أو ضمن مجموعتنا.
- في إطار صفقة تجارية كالاندماج أو الإفلاس، أو للامتثال للالتزامات القانونية.

لا نستخدم المعلومات الشخصية الحساسة ولا نكشف عنها دون موافقتك.

## فئات المعلومات الشخصية والمستفيدون منها

قد نكشف عن الفئات التالية من المعلومات الشخصية للمستفيدين على النحو المبيّن أعلاه:

- المعرّفات كبيانات الاتصال وبعض معلومات الطلب/الحساب.
- المعلومات التجارية كمعلومات الطلب وبيانات التسوق.
- نشاط الإنترنت أو الشبكات المماثلة كبيانات الاستخدام.
- بيانات الموقع الجغرافي كالمواقع المحددة عبر عنوان IP.

## مواقع وروابط الأطراف الثالثة

قد يتضمن موقعنا روابط لمواقع إلكترونية أو منصات رقمية أخرى تديرها أطراف ثالثة. إذا اتبعت روابط لمواقع غير تابعة لنا، فيُرجى مراجعة سياسات الخصوصية الخاصة بها. لا نضمن ولا نتحمل المسؤولية عن الممارسات الخاصة بالخصوصية لمواقع الأطراف الثالثة تلك.

## بيانات الأطفال

لا تستهدف الخدمات الأطفال، ولا نجمع معلوماتهم الشخصية عن قصد. إذا كنت والداً أو وصياً وتعتقد أن طفلك قد زوّدنا بمعلوماته الشخصية، يُرجى التواصل معنا لطلب حذفها.

## أمان معلوماتك والاحتفاظ بها

لا توجد إجراءات أمنية مثالية تماماً. نتخذ ضمانات معقولة لحماية المعلومات الشخصية، غير أننا لا نستطيع ضمان الأمان المطلق. تتفاوت فترات الاحتفاظ تبعاً لاحتياجات العمل والالتزامات القانونية.

## حقوقك

بحسب مكان إقامتك، قد تتمتع بحقوق الوصول إلى معلوماتك الشخصية أو حذفها أو تصحيحها أو نقلها، وتقييد معالجتها، وسحب موافقتك، والطعن في القرارات المتخذة. كما يمكنك إدارة تفضيلات التواصل والإلغاء من الاشتراك في رسائل البريد الإلكتروني الترويجية.

- **حق الوصول/المعرفة:** طلب الاطلاع على المعلومات الشخصية التي نحتفظ بها عنك.
- **حق الحذف:** طلب حذف معلوماتك الشخصية.
- **حق التصحيح:** طلب تصحيح المعلومات غير الدقيقة.
- **حق نقل البيانات:** طلب نسخة من معلوماتك الشخصية لنقلها.
- **تقييد المعالجة:** طلب الحد من المعالجة في حالات معينة.
- **سحب الموافقة:** سحب موافقتك حيثما تستند المعالجة إلى الموافقة.

## الشكاوى

إذا كانت لديك شكاوى بشأن معالجتنا لمعلوماتك الشخصية، تواصل معنا على التفاصيل الواردة أدناه. إذا لم تكن راضياً عن ردّنا، فقد يحق لك —بحسب ولايتك القضائية— تقديم شكوى إلى هيئة حماية البيانات المحلية المختصة.

## المستخدمون الدوليون

قد ننقل معلوماتك الشخصية ونخزنها ونعالجها خارج البلد الذي تقيم فيه. حيثما ينطبق ذلك، نعتمد على آليات النقل المعترف بها، كالبنود التعاقدية النموذجية الصادرة عن المفوضية الأوروبية عند نقل البيانات من الاتحاد الأوروبي.

## التواصل معنا

إذا كانت لديك أسئلة حول ممارساتنا المتعلقة بالخصوصية أو كنت ترغب في ممارسة أي من حقوقك، يُرجى التواصل معنا على [6464ssq@gmail.com](mailto:6464ssq@gmail.com) أو عبر البريد إلى: مدينة حمد، 408-1206-1212، 00000، البحرين.
    `,
  },
};

// ─── تنسيق عناصر الماركداون يدوياً (بدون الاعتماد على إضافة typography) ──────

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="mt-10 mb-3 text-xl font-bold text-slate-900 first:mt-0 dark:text-white">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-2 text-lg font-semibold text-slate-900 dark:text-white">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-4 mb-2 text-base font-semibold text-slate-800 dark:text-slate-100">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900 dark:text-white">{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-golden underline underline-offset-2 hover:text-golden/80"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 ps-5">{children}</ul>,
  li: ({ children }) => <li className="text-slate-700 dark:text-slate-300">{children}</li>,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  // نستخدم نفس الـ hook الموجود في الناف بار — لا حاجة لأزرار تبديل هنا
  const { locale } = useTranslation();

  const lang = locale === "ar" ? "ar" : "en";
  const { title, lastUpdated, body } = privacyContent[lang];

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="relative mb-3 inline-block text-3xl font-bold text-slate-900 dark:text-white">
        {title}
        <span className="absolute -bottom-2 left-0 h-1 w-16 rounded-full bg-golden" />
      </h1>
      <p className="mt-4 mb-8 text-sm text-slate-500 dark:text-slate-400">{lastUpdated}</p>
      <ReactMarkdown components={markdownComponents}>{body}</ReactMarkdown>
    </main>
  );
}
