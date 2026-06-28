"use client";

// ============================================================
// Products Grid — responsive, skeleton loading, motion reveal
// ============================================================
import { Suspense } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MOCK_PRODUCTS } from "@/lib/mockData";

const FEATURED_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.isFeatured).slice(0, 8);

import { useTranslation } from "@/utils/i18n";

export function ProductsGrid() {
  const { t } = useTranslation();
  return (
    <section
      className="bg-white py-20 sm:py-28"
      aria-labelledby="products-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-golden">
            {t("bestsellers.tag")}
          </span>
          <h2
            id="products-heading"
            className="text-4xl font-bold tracking-tight sm:text-5xl"
          >
            {t("bestsellers.title")}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-muted-foreground leading-relaxed">
            {t("bestsellers.description")}
          </p>
        </motion.div>

        {/* Products grid */}
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {FEATURED_PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </Suspense>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <Button size="lg" variant="outline" className="group" asChild>
            <Link href="/shop">
              {t("bestsellers.viewAll")}
              <ArrowRight
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
