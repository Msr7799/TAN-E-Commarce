"use client";

// ============================================================
// Global Error Boundary page — catches layout level crashes
// ============================================================
import { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to application logging system
    logger.error("Layout crash caught by boundary", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-cream/10 px-4 text-center">
      <div className="space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-md">
          <AlertOctagon className="h-8 w-8" />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Something went wrong!
        </h1>

        <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed">
          An unexpected error occurred while loading this page. We have logged the issue and are looking into it.
        </p>

        {/* Dynamic actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Button size="lg" onClick={() => reset()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button size="lg" variant="outline" onClick={() => (window.location.href = "/")}>
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
