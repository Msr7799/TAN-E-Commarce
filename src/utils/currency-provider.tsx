"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  CURRENCIES,
  CurrencyCode,
  CurrencyConfig,
  DEFAULT_CURRENCY,
  ExchangeRates,
  SUPPORTED_CURRENCY_CODES,
  formatPriceSimple,
  getBrowserCurrencyCode,
  getCurrentCurrencyCode,
  getSavedCurrencyCode,
  getStoredExchangeRates,
  saveCurrencyCode,
  saveExchangeRates,
  shouldRefreshExchangeRates,
  convertAmount,
} from "./currency";

interface CurrencyContextValue {
  currency: CurrencyConfig;
  supportedCurrencies: CurrencyConfig[];
  exchangeRates?: ExchangeRates;
  isLoadingRates: boolean;
  setCurrency: (code: CurrencyCode) => void;
  refreshRates: () => Promise<void>;
  formatPrice: (amount: number, currencyCode?: CurrencyCode) => string;
  convertAmount: (amount: number, from?: CurrencyCode, to?: CurrencyCode) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

interface CurrencyProviderProps {
  children: React.ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<CurrencyConfig>(() => {
    const saved = getSavedCurrencyCode();
    const code = saved ?? getCurrentCurrencyCode();
    return CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY];
  });
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | undefined>(() => {
    return getStoredExchangeRates();
  });
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const setCurrency = (code: CurrencyCode) => {
    const nextCurrency = CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY];
    setCurrencyState(nextCurrency);
    saveCurrencyCode(nextCurrency.code);
  };

  const formatPrice = (amount: number, currencyCode?: CurrencyCode) => {
    return formatPriceSimple(amount, currencyCode ?? currency.code, exchangeRates);
  };

  const refreshRates = async () => {
    setIsLoadingRates(true);
    try {
      const response = await fetch(
        "/api/exchange-rates?base=BHD&symbols=BHD,SAR,AED,KWD,OMR,QAR,USD",
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error("Failed to load exchange rates");
      }
      const data = (await response.json()) as {
        base: string;
        rates: Record<string, number>;
      };

      const parsedRates = {
        base: data.base as CurrencyCode,
        rates: SUPPORTED_CURRENCY_CODES.reduce(
          (acc, code) => {
            acc[code] = data.rates[code] ?? CURRENCIES[code].rateToBHD;
            return acc;
          },
          {} as Record<CurrencyCode, number>
        ),
        timestamp: Date.now(),
      };

      setExchangeRates(parsedRates);
      saveExchangeRates(parsedRates);
    } catch {
      // leave existing exchangeRates unchanged
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    if (shouldRefreshExchangeRates(exchangeRates)) {
      void refreshRates();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = getSavedCurrencyCode();
    if (!saved) {
      setCurrencyState(CURRENCIES[getBrowserCurrencyCode()] ?? CURRENCIES[DEFAULT_CURRENCY]);
    }
  }, []);

  useEffect(() => {
    saveCurrencyCode(currency.code);
  }, [currency.code]);

  const value = useMemo(
    () => ({
      currency,
      supportedCurrencies: Object.values(CURRENCIES),
      exchangeRates,
      isLoadingRates,
      setCurrency,
      refreshRates,
      formatPrice,
      convertAmount: (amount: number, from?: CurrencyCode, to?: CurrencyCode) =>
        convertAmount(amount, from ?? DEFAULT_CURRENCY, to ?? currency.code, exchangeRates),
    }),
    [currency, exchangeRates, isLoadingRates]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  return context;
}
