"use client";

// ============================================================
// Products Grid — promotions and order-now product sections
// ============================================================
import { motion } from "motion/react";
import { ProductCard } from "@/components/shared/ProductCard";
import { MOCK_PRODUCTS } from "@/lib/mockData";

const PROMOTION_PRODUCTS = MOCK_PRODUCTS.filter((product) => product.category === "bundles");
const ORDER_NOW_PRODUCTS = MOCK_PRODUCTS.filter((product) => product.category === "tanning-oil");

import { useTranslation } from "@/utils/i18n";

export function ProductsGrid() {
  const { t } = useTranslation();
  return (
    <section className="bg-[#e9e6e2] py-14 sm:py-20" aria-labelledby="products-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2
            id="products-heading"
            className="text-xl font-black tracking-[0.08em] text-black uppercase sm:text-2xl"
          >
            Promotions
          </h2>
          <p className="mt-3 text-sm font-semibold text-black/70">up to 40%</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-3xl">
          {PROMOTION_PRODUCTS.map((product, i) => (
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 mb-8"
        >
          <h2 className="text-xl font-black tracking-[0.08em] text-black uppercase sm:text-2xl">
            Order Now!
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-black/65">{t("bestsellers.description")}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ORDER_NOW_PRODUCTS.map((product, i) => (
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
      </div>
    </section>
  );
}
