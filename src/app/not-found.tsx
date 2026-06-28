import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================================
// Not Found Page — 404 Handler
// ============================================================

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-cream/10 px-4 text-center">
      <div className="space-y-4">
        {/* Large visual */}
        <div className="text-8xl font-black text-golden/30 select-none">404</div>
        
        <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
          Page Not Found
        </h1>
        
        <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed">
          Sorry, we couldn&apos;t find the page you are looking for. It might have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6">
          <Button size="lg" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/shop">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Shop
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
