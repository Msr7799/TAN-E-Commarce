// ============================================================
// Skeleton loading components
// ============================================================
import { cn } from "@/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-beige/60", className)} aria-hidden="true" />
  );
}

// ——— Product Card Skeleton ———————————————————
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-beige bg-white p-0">
      {/* Image */}
      <Skeleton className="aspect-square w-full rounded-none rounded-t-3xl" />
      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-4 w-1/3 rounded-full" />
        <Skeleton className="h-5 w-3/4 rounded-full" />
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-2/3 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-24 rounded-full" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ——— Product Grid Skeleton ————————————————
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ——— Product Detail Skeleton ——————————————
export function ProductDetailSkeleton() {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-3xl" />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-10 w-3/4 rounded-xl" />
        <Skeleton className="h-4 w-1/2 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="flex gap-4">
          <Skeleton className="h-12 flex-1 rounded-full" />
          <Skeleton className="h-12 flex-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ——— Hero Skeleton ——————————————————————
export function HeroSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Skeleton className="mx-auto mb-4 h-4 w-48 rounded-full" />
        <Skeleton className="mx-auto mb-6 h-16 w-3/4 rounded-xl" />
        <Skeleton className="mx-auto mb-8 h-5 w-1/2 rounded-full" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-36 rounded-full" />
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}
