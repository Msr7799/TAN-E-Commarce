"use client";

// ============================================================
// Infinite Carousel — auto-scroll, loop, pause on hover, touch
// ============================================================
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import { formatPriceSimple } from "@/utils";

const ITEMS = [...MOCK_PRODUCTS, ...MOCK_PRODUCTS]; // duplicate for seamless loop

export function InfiniteCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="overflow-hidden bg-black py-10"
      aria-label="Featured products carousel"
      aria-roledescription="carousel"
    >
      {/* Headline strip */}
      <div className="mb-8 flex items-center justify-center gap-4 px-4">
        <span className="h-px flex-1 bg-white/10 max-w-xs" aria-hidden="true" />
        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-golden">
          Our Bestsellers
        </h2>
        <span className="h-px flex-1 bg-white/10 max-w-xs" aria-hidden="true" />
      </div>

      {/* Carousel track wrapper — gradient fade edges */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-black to-transparent"
          aria-hidden="true"
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-black to-transparent"
          aria-hidden="true"
        />

        {/* Scrolling track */}
        <motion.div
          ref={trackRef}
          className="flex gap-4"
          animate={{ x: isPaused ? undefined : [0, "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          // When paused, maintain current position gracefully
          {...(isPaused ? { style: { animationPlayState: "paused" } } : {})}
          aria-live="off"
        >
          {ITEMS.map((product, i) => (
            <CarouselCard key={`${product.id}-${i}`} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ——— Individual carousel card ————————————————
interface CarouselCardProps {
  product: (typeof MOCK_PRODUCTS)[0];
}

function CarouselCard({ product }: CarouselCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative flex w-52 shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-colors hover:border-golden/30"
      role="group"
      aria-label={product.name}
    >
      {/* Image placeholder */}
      <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-golden/20 to-amber-900/20">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-golden/20">
            <span className="text-xl font-bold text-golden">
              {product.name.charAt(0)}
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-4">
        <p className="line-clamp-1 text-sm font-semibold text-white">
          {product.name}
        </p>
        <p className="text-xs text-white/50 capitalize">
          {product.category.replace(/-/g, " ")}
        </p>
        <p className="text-sm font-bold text-golden">
          {formatPriceSimple(product.price)}
        </p>
      </div>
    </motion.div>
  );
}
