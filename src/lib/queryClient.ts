// ============================================================
// TanStack Query client configuration (Pure TypeScript)
// ============================================================
import { QueryClient } from "@tanstack/react-query";
import { logger } from "@/lib/logger";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time: 5 minutes — avoids refetching on every mount
        staleTime: 1000 * 60 * 5,
        // Cache time: 10 minutes
        gcTime: 1000 * 60 * 10,
        // Retry 2 times on failure
        retry: 2,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
        // Don't refetch on window focus in development
        refetchOnWindowFocus: process.env.NODE_ENV === "production",
      },
      mutations: {
        onError: (error) => {
          logger.error("Mutation failed", { error: String(error) });
        },
      },
    },
  });
}

// Singleton for server-side; fresh instance per browser session
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always create new client
    return makeQueryClient();
  }
  // Browser: reuse existing client or create if needed
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
