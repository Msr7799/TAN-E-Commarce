// ============================================================
// Star Rating component
// ============================================================
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/utils";
import { getRatingStars } from "@/utils";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

export function StarRating({
  rating,
  reviewCount,
  size = "md",
  showCount = true,
  className,
}: StarRatingProps) {
  const { full, half, empty } = getRatingStars(rating);
  const starSize = sizeMap[size];

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      aria-label={`Rating: ${rating} out of 5 stars${reviewCount ? `, ${reviewCount} reviews` : ""}`}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(starSize, "fill-golden text-golden")}
            aria-hidden="true"
          />
        ))}
        {half && (
          <StarHalf
            className={cn(starSize, "fill-golden text-golden")}
            aria-hidden="true"
          />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(starSize, "fill-none text-golden/30")}
            aria-hidden="true"
          />
        ))}
      </div>

      {showCount && reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">
          {rating.toFixed(1)} ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
}
