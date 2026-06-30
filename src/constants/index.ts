// ============================================================
// Application-wide constants
// ============================================================

// ——— Site Info ——————————————————————————————
export const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Merbella Tan";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://merbellatan.com";
export const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? "Merbella Tan - Natural & Safe Tanning Products";
export const SITE_LOCALE = process.env.NEXT_PUBLIC_SITE_LOCALE ?? "en_US";
export const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "@merbellatan";

// ——— WhatsApp ———————————————————————————————
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "00000000000";
export const WHATSAPP_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ??
  "Hello! I'm interested in your premium tanning products.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

// ——— Navigation ——————————————————————————————
export const NAV_LINKS = [
  { label: "nav.home", href: "/" },
  { label: "nav.shop", href: "/shop" },
  { label: "nav.about", href: "/about" },
  { label: "nav.faq", href: "/faq" },
  { label: "nav.contact", href: "/contact" },
] as const;

// ——— Footer Links ————————————————————————————
export const FOOTER_LINKS = {
  shop: [
    { label: "footer.shop.allProducts", href: "/shop" },
    { label: "footer.shop.selfTanners", href: "/shop?category=self-tanner" },
    { label: "footer.shop.tanningLotions", href: "/shop?category=tanning-lotion" },
    { label: "footer.shop.bronzers", href: "/shop?category=bronzer" },
    { label: "footer.shop.accessories", href: "/shop?category=accessories" },
    { label: "footer.shop.bundles", href: "/shop?category=bundles" },
  ],
  support: [
    { label: "footer.support.faq", href: "/faq" },
    { label: "footer.support.contactUs", href: "/contact" },
    { label: "footer.support.shippingPolicy", href: "/shipping" },
    { label: "footer.support.returns", href: "/returns" },
  ],
  company: [
    { label: "footer.company.aboutUs", href: "/about" },
    { label: "footer.company.privacyPolicy", href: "/privacy" },
    { label: "footer.company.termsOfService", href: "/terms" },
  ],
} as const;

// ——— Product Categories ——————————————————————
export const PRODUCT_CATEGORIES = [
  { value: "self-tanner", label: "Self Tanners" },
  { value: "tanning-lotion", label: "Tanning Lotions" },
  { value: "bronzer", label: "Bronzers" },
  { value: "after-sun", label: "After Sun Care" },
  { value: "accessories", label: "Accessories" },
  { value: "bundles", label: "Bundles" },
] as const;

// ——— Sort Options ————————————————————————————
export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
] as const;

// ——— Currency ————————————————————————————————
export const CURRENCY = "BHD";
export const CURRENCY_SYMBOL = "BD";
export const FREE_SHIPPING_THRESHOLD = 0;
export const SHIPPING_COST = 0.0;

// ——— Pagination ——————————————————————————————
export const PRODUCTS_PER_PAGE = 12;
export const SEARCH_DEBOUNCE_MS = 350;

// ——— Animation Durations ————————————————————
export const ANIMATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.6,
  verySlow: 1.0,
} as const;

// ——— Carousel ————————————————————————————————
export const CAROUSEL_SPEED = 40; // pixels per second
export const CAROUSEL_PAUSE_ON_HOVER = true;

// ——— Stock Thresholds ————————————————————————
export const LOW_STOCK_THRESHOLD = 5;

// ——— AI ——————————————————————————————————————
export const AI_ENABLED = process.env.NEXT_PUBLIC_AI_ENABLED === "true";
export const AI_MAX_CONTEXT_ITEMS = 20; // max items tracked per session
