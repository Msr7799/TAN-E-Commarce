// ============================================================
// الدوال المساعدة العامة (Utility Functions)
// ============================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/constants";
import type { CartItem, CartSummary } from "@/types";

/**
 * دالة مساعدة لدمج كلاسات Tailwind CSS بشكل آمن وتجنب التكرار والتعارض.
 * تستخدم clsx لتجميع الكلاسات و twMerge لحل التعارضات.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// واجهة برمجية لتحديد خصائص العملة وتكوينها
interface CurrencyConfig {
  code: string;       // رمز العملة الدولي (مثل BHD, SAR)
  symbolEn: string;   // الرمز باللغة الإنجليزية (مثل BD, SR)
  symbolAr: string;   // الرمز باللغة العربية (مثل د.ب, ر.س)
  rate: number;       // سعر الصرف مقابل الدينار البحريني (العملة الأساسية للموقع)
  decimals: number;   // عدد الخانات العشرية بعد الفاصلة
}

// قائمة العملات المدعومة في دول الخليج والدولار الأمريكي مع أسعار الصرف بالنسبة للدينار البحريني
const CURRENCIES: Record<string, CurrencyConfig> = {
  BHD: { code: "BHD", symbolEn: "BD", symbolAr: "د.ب", rate: 1.0, decimals: 3 },
  SAR: { code: "SAR", symbolEn: "SR", symbolAr: "ر.س", rate: 9.97, decimals: 2 },
  AED: { code: "AED", symbolEn: "AED", symbolAr: "د.إ", rate: 9.75, decimals: 2 },
  KWD: { code: "KWD", symbolEn: "KD", symbolAr: "د.ك", rate: 0.81, decimals: 3 },
  OMR: { code: "OMR", symbolEn: "OMR", symbolAr: "ر.ع", rate: 1.02, decimals: 3 },
  QAR: { code: "QAR", symbolEn: "QR", symbolAr: "ر.ق", rate: 9.66, decimals: 2 },
  USD: { code: "USD", symbolEn: "$", symbolAr: "$", rate: 2.65, decimals: 2 },
};

/**
 * دالة للتعرف التلقائي على دولة المستخدم وعملتها بناءً على المنطقة الزمنية للمتصفح (Timezone)
 * أو لغة المتصفح المفضلة (Navigator Language) كخيار احتياطي.
 */
export function getDetectedCurrency(): CurrencyConfig {
  if (typeof window === "undefined") {
    return CURRENCIES.BHD; // الإرجاع الافتراضي أثناء المعالجة على الخادم (SSR)
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes("Riyadh") || tz.includes("Jeddah") || tz.includes("Asia/Riyadh")) return CURRENCIES.SAR;
    if (tz.includes("Dubai") || tz.includes("Abu_Dhabi") || tz.includes("Asia/Dubai")) return CURRENCIES.AED;
    if (tz.includes("Kuwait") || tz.includes("Asia/Kuwait")) return CURRENCIES.KWD;
    if (tz.includes("Muscat") || tz.includes("Asia/Muscat")) return CURRENCIES.OMR;
    if (tz.includes("Qatar") || tz.includes("Doha") || tz.includes("Asia/Qatar")) return CURRENCIES.QAR;
    if (tz.includes("Bahrain") || tz.includes("Asia/Bahrain")) return CURRENCIES.BHD;
    
    // فحص كود الدولة في لغة المتصفح كخيار ثانوي
    const lang = navigator.language.toLowerCase();
    if (lang.endsWith("-sa")) return CURRENCIES.SAR;
    if (lang.endsWith("-ae")) return CURRENCIES.AED;
    if (lang.endsWith("-kw")) return CURRENCIES.KWD;
    if (lang.endsWith("-om")) return CURRENCIES.OMR;
    if (lang.endsWith("-qa")) return CURRENCIES.QAR;
    if (lang.endsWith("-bh")) return CURRENCIES.BHD;

    return CURRENCIES.BHD; // القيمة الافتراضية هي الدينار البحريني
  } catch {
    return CURRENCIES.BHD;
  }
}

/**
 * تنسيق السعر بالكامل مع الرمز كعملة رسمية للنظام.
 * تقوم بالتحويل التلقائي بناءً على سعر صرف العملة النشطة.
 */
export function formatPrice(amount: number, currency?: string): string {
  const config = getDetectedCurrency();
  const activeCurrency = currency || config.code;
  const activeConfig = CURRENCIES[activeCurrency] || CURRENCIES.BHD;
  const convertedAmount = amount * activeConfig.rate;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: activeConfig.code,
    minimumFractionDigits: activeConfig.decimals,
    maximumFractionDigits: activeConfig.decimals,
  }).format(convertedAmount);
}

/**
 * تنسيق السعر البسيط مع وضع الرمز بجانب الرقم مع مراعاة اتجاه اللغة (عربي / إنجليزي).
 */
export function formatPriceSimple(amount: number): string {
  const isClient = typeof window !== "undefined";
  const isArabic = isClient && document.documentElement.lang === "ar";
  
  const config = getDetectedCurrency();
  const convertedAmount = amount * config.rate;
  const formattedAmount = convertedAmount.toLocaleString("en-US", {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  const symbol = isArabic ? config.symbolAr : config.symbolEn;
  if (config.code === "USD") {
    return isArabic ? `${formattedAmount} دولار` : `$${formattedAmount}`;
  }
  return isArabic ? `${formattedAmount} ${symbol}` : `${symbol} ${formattedAmount}`;
}

/**
 * دالة لحساب وعرض نسبة الخصم بين السعر الأصلي وسعر البيع.
 */
export function formatDiscount(original: number, sale: number): string {
  const pct = Math.round(((original - sale) / original) * 100);
  return `-${pct}%`;
}

/**
 * حساب ملخص السلة بما يشمل المجموع الفرعي، تكلفة الشحن، قيمة الخصم والمجموع الكلي.
 */
export function calculateCartSummary(items: CartItem[], couponDiscount = 0): CartSummary {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  // الشحن مجاني إذا تجاوز المجموع الحد الأدنى المحدد في الثوابت
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : SHIPPING_COST;
  const discount = subtotal * (couponDiscount / 100);
  const total = Math.max(0, subtotal - discount + shipping);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, shipping, discount, total, itemCount };
}

/**
 * توليد اسم لطيف (Slug) للروابط (URL) من اسم المنتج.
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * قص النصوص الطويلة وعرض علامة (...) في نهايتها.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

/**
 * دالة التحكم بمعدل التنفيذ (Debounce) لمنع تنفيذ العمليات المتكررة بكثرة (مثل البحث أثناء الكتابة).
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * دالة تحديد صيغة الجمع للكلمات باللغة الإنجليزية بناءً على العدد.
 */
export function pluralise(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

/**
 * حساب عدد النجوم الكاملة والنصف فارغة والنجوم الفارغة لتقييم المنتج.
 */
export function getRatingStars(rating: number): {
  full: number;
  half: boolean;
  empty: number;
} {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}

/**
 * تحليل نصوص الـ JSON بشكل آمن وتجنب توقف التطبيق في حال وجود أخطاء في الصياغة.
 */
export function safeJsonParse<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

/**
 * تحديد مسمى وحالة توفر المخزن للمنتج وتحديد كود اللون المناسب (أخضر للمتوفر، برتقالي للقرب النفاد، أحمر للنافد).
 */
export function getStockLabel(
  status: string,
  count: number
): { label: string; color: string } {
  if (status === "out_of_stock") return { label: "Out of Stock", color: "text-red-500" };
  if (status === "low_stock" || count <= 5)
    return { label: `Only ${count} left!`, color: "text-amber-500" };
  return { label: "In Stock", color: "text-emerald-500" };
}

/**
 * دالة مساعدة لعمل تأخير زمني (Wait / Sleep) باستخدام الـ Promises.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * بناء روابط الـ URL مع معاملات البحث (Query Parameters) بشكل آمن وتجاهل المعاملات الفارغة.
 */
export function buildUrl(base: string, params: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(base, "http://localhost");
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return `${url.pathname}${url.search}`;
}
