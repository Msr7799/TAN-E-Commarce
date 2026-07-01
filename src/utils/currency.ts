// ============================================================
// Currency utilities and conversion helpers
// ============================================================

export const SUPPORTED_CURRENCY_CODES = ["BHD", "SAR", "AED", "KWD", "OMR", "QAR", "USD"] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCY_CODES)[number];

export interface CurrencyConfig {
  code: CurrencyCode;
  label: string;
  symbolEn: string;
  symbolAr: string;
  decimals: number;
  rateToBHD: number; // static fallback rate relative to BHD
  flag: string; // emoji flag for the country
}

export const DEFAULT_CURRENCY: CurrencyCode = "BHD";

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  BHD: {
    code: "BHD",
    label: "Bahraini Dinar",
    symbolEn: "BD",
    symbolAr: "د.ب",
    decimals: 3,
    rateToBHD: 1.0,
    flag: "🇧🇭",
  },
  SAR: {
    code: "SAR",
    label: "Saudi Riyal",
    symbolEn: "SR",
    symbolAr: "ر.س",
    decimals: 2,
    rateToBHD: 9.97,
    flag: "🇸🇦",
  },
  AED: {
    code: "AED",
    label: "UAE Dirham",
    symbolEn: "AED",
    symbolAr: "د.إ",
    decimals: 2,
    rateToBHD: 9.75,
    flag: "🇦🇪",
  },
  KWD: {
    code: "KWD",
    label: "Kuwaiti Dinar",
    symbolEn: "KD",
    symbolAr: "د.ك",
    decimals: 3,
    rateToBHD: 0.81,
    flag: "🇰🇼",
  },
  OMR: {
    code: "OMR",
    label: "Omani Rial",
    symbolEn: "OMR",
    symbolAr: "ر.ع",
    decimals: 3,
    rateToBHD: 1.02,
    flag: "🇴🇲",
  },
  QAR: {
    code: "QAR",
    label: "Qatari Riyal",
    symbolEn: "QR",
    symbolAr: "ر.ق",
    decimals: 2,
    rateToBHD: 9.66,
    flag: "🇶🇦",
  },
  USD: {
    code: "USD",
    label: "US Dollar",
    symbolEn: "$",
    symbolAr: "$",
    decimals: 2,
    rateToBHD: 2.65,
    flag: "🇺🇸",
  },
};

export interface ExchangeRates {
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  timestamp: number;
}

const CURRENCY_STORAGE_KEY = "merbella-selected-currency";
const EXCHANGE_RATES_STORAGE_KEY = "merbella-exchange-rates";
const EXCHANGE_RATES_TTL = 1000 * 60 * 60 * 12; // 12 hours

const TIMEZONE_CURRENCY_MAP: Record<string, CurrencyCode> = {
  "Asia/Bahrain": "BHD",
  "Asia/Qatar": "QAR",
  "Asia/Doha": "QAR",
  "Asia/Riyadh": "SAR",
  "Asia/Jeddah": "SAR",
  "Asia/Dubai": "AED",
  "Asia/Abu_Dhabi": "AED",
  "Asia/Kuwait": "KWD",
  "Asia/Muscat": "OMR",
};

const LANG_REGION_CURRENCY_MAP: Record<string, CurrencyCode> = {
  bh: "BHD",
  sa: "SAR",
  ae: "AED",
  kw: "KWD",
  om: "OMR",
  qa: "QAR",
  us: "USD",
  uk: "USD",
  ca: "USD",
  au: "USD",
};

function normalizeLocale(locale: string | undefined): string {
  return locale?.trim().toLowerCase() ?? "";
}

export function getSavedCurrencyCode(): CurrencyCode | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (stored && SUPPORTED_CURRENCY_CODES.includes(stored as CurrencyCode)) {
      return stored as CurrencyCode;
    }
  } catch {
    // ignore storage errors
  }
  return undefined;
}

export function saveCurrencyCode(code: CurrencyCode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  } catch {
    // ignore storage errors
  }
}

export function getBrowserCurrencyCode(): CurrencyCode {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone && TIMEZONE_CURRENCY_MAP[timezone]) {
    return TIMEZONE_CURRENCY_MAP[timezone];
  }

  const language = normalizeLocale(window.navigator.language || window.navigator.languages?.[0]);
  if (language) {
    const region = language.split("-").pop();
    if (region && LANG_REGION_CURRENCY_MAP[region]) {
      return LANG_REGION_CURRENCY_MAP[region];
    }
  }

  const localeFromLanguages = window.navigator.languages
    ? window.navigator.languages.map(normalizeLocale)
    : [];

  for (const locale of localeFromLanguages) {
    const region = locale.split("-").pop();
    if (region && LANG_REGION_CURRENCY_MAP[region]) {
      return LANG_REGION_CURRENCY_MAP[region];
    }
  }

  return DEFAULT_CURRENCY;
}

export function getCurrentCurrencyCode(): CurrencyCode {
  return getSavedCurrencyCode() ?? getBrowserCurrencyCode();
}

export function getStoredExchangeRates(): ExchangeRates | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const serialized = window.localStorage.getItem(EXCHANGE_RATES_STORAGE_KEY);
    if (!serialized) return undefined;
    const parsed = JSON.parse(serialized) as ExchangeRates;
    if (!parsed || typeof parsed !== "object") return undefined;
    if (typeof parsed.timestamp !== "number") return undefined;
    if (!parsed.rates || typeof parsed.rates !== "object") return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

export function saveExchangeRates(exchangeRates: ExchangeRates) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EXCHANGE_RATES_STORAGE_KEY, JSON.stringify(exchangeRates));
  } catch {
    // ignore
  }
}

export function shouldRefreshExchangeRates(rates?: ExchangeRates): boolean {
  if (!rates) return true;
  return Date.now() - rates.timestamp > EXCHANGE_RATES_TTL;
}

export function convertAmount(
  amount: number,
  from: CurrencyCode = DEFAULT_CURRENCY,
  to: CurrencyCode = DEFAULT_CURRENCY,
  rates?: ExchangeRates
): number {
  if (from === to) return amount;

  if (rates?.rates && rates.rates[from] && rates.rates[to]) {
    return amount * (rates.rates[to] / rates.rates[from]);
  }

  const fromRate = CURRENCIES[from]?.rateToBHD ?? 1;
  const toRate = CURRENCIES[to]?.rateToBHD ?? 1;
  return amount * (toRate / fromRate);
}

export function formatCurrency(
  amount: number,
  currencyCode?: CurrencyCode,
  rates?: ExchangeRates,
  locale?: string
): string {
  const code = currencyCode ?? getCurrentCurrencyCode();
  const config = CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY];
  const convertedAmount = convertAmount(amount, DEFAULT_CURRENCY, code, rates);
  const formatLocale =
    locale ||
    (typeof window !== "undefined" && document.documentElement.lang === "ar" ? "ar" : "en-US");

  return new Intl.NumberFormat(formatLocale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(convertedAmount);
}

export function formatPriceSimple(
  amount: number,
  currencyCode?: CurrencyCode,
  rates?: ExchangeRates,
  locale?: string
): string {
  return formatCurrency(amount, currencyCode, rates, locale);
}
