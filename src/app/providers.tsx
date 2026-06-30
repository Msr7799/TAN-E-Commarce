"use client";

import { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/queryClient";
import { Toaster } from "sonner";
import { CartDrawer } from "@/features/cart/CartDrawer";
import { SearchOverlay } from "@/features/search/SearchOverlay";
import { LanguageProvider } from "@/utils/i18n";
import { CurrencyProvider } from "@/utils/currency-provider";
import { AuthProvider } from "@/hooks/useAuth";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Obtain or create the query client instance
  const [queryClient] = useState(() => getQueryClient());

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <CurrencyProvider>
            {children}
            {/* Shared overlays */}
            <CartDrawer />
            <SearchOverlay />
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "#ffffff",
                  color: "#0a0a0a",
                  border: "1px solid #f5edd8",
                  borderRadius: "1rem",
                  fontFamily: "var(--font-sans)",
                },
                className: "MarbellaTan-toast",
              }}
            />
          </CurrencyProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
