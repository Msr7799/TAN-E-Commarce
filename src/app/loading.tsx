// ============================================================
// Global Loading page fallback for layout streaming/suspense
// ============================================================
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-cream/10">
      <div className="flex flex-col items-center gap-4">
        {/* Loading Spinner */}
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-golden" aria-hidden="true" />
          <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border border-golden/30 opacity-50" />
        </div>
        <p className="text-sm font-semibold tracking-wider text-golden uppercase animate-pulse">
          Luxe Tan
        </p>
      </div>
    </div>
  );
}
