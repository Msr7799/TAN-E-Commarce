"use client";

// ============================================================
// ProductCard — responsive card with motion animations
// ============================================================
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPriceSimple, formatDiscount, getStockLabel, cn } from "@/utils";
import type { Product } from "@/types";

import { useTranslation } from "@/utils/i18n";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { t } = useTranslation();
  const inWishlist = isInWishlist(product.id);
  const stockInfo = getStockLabel(product.stockStatus, product.stockCount);
  const isOutOfStock = product.stockStatus === "out_of_stock";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || isAddingToCart) return;
    setIsAddingToCart(true);
    addItem(product);
    await new Promise((r) => setTimeout(r, 600));
    setIsAddingToCart(false);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem(product.id);
  };

  const getTranslatedStockLabel = () => {
    if (product.stockStatus === "out_of_stock") {
      return t("productDetail.stock.outOfStock");
    }
    if (product.stockStatus === "low_stock" || product.stockCount <= 5) {
      return t("productDetail.stock.lowStock", { count: product.stockCount });
    }
    return t("productDetail.stock.inStock");
  };

  const translatedName = t(`products.${product.id}.name`);
  const productName = translatedName !== `products.${product.id}.name` ? translatedName : product.name;

  const translatedShortDesc = t(`products.${product.id}.shortDescription`);
  const productShortDesc = translatedShortDesc !== `products.${product.id}.shortDescription` ? translatedShortDesc : product.shortDescription;

  const newLabel = t("productDetail.new") !== "productDetail.new" ? t("productDetail.new") : "New";
  const viewProductLabel = t("productDetail.viewProduct") !== "productDetail.viewProduct" ? t("productDetail.viewProduct") : "View Product";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-beige bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-black/8"
    >
      {/* Image area */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-gradient-to-br from-cream to-beige"
        aria-label={`View ${productName}`}
        tabIndex={0}
      >
        {/* Placeholder */}
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-golden/40">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-golden/10">
              <span className="text-3xl font-bold text-golden/60">
                {productName.charAt(0)}
              </span>
            </div>
            <span className="text-xs font-medium uppercase tracking-widest text-golden/40">
              {product.category.replace(/-/g, " ")}
            </span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-black shadow-md">
              <Eye className="h-4 w-4" aria-hidden="true" />
            </span>
          </motion.div>
        </div>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <Badge variant="new" className="text-[10px]">{newLabel}</Badge>
          )}
          {product.discount && product.compareAtPrice && (
            <Badge variant="golden" className="text-[10px]">
              {formatDiscount(product.compareAtPrice, product.price)}
            </Badge>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-all",
            inWishlist
              ? "bg-red-50 text-red-500"
              : "bg-white/80 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
          )}
          aria-label={inWishlist ? `${t("productDetail.wishlistRemove")} ${productName}` : `${t("productDetail.wishlistAdd")} ${productName}`}
          aria-pressed={inWishlist}
        >
          <Heart
            className="h-4 w-4"
            fill={inWishlist ? "currentColor" : "none"}
          />
        </button>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Stock badge */}
        <div>
          <span className={cn("text-xs font-semibold", stockInfo.color)}>
            {getTranslatedStockLabel()}
          </span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.slug}`} className="group/link">
          <h3 className="font-semibold leading-tight line-clamp-2 transition-colors group-hover/link:text-golden">
            {productName}
          </h3>
        </Link>

        {/* Short description */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
          {productShortDesc}
        </p>

        {/* Rating */}
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size="sm"
        />

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-golden">
            {formatPriceSimple(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPriceSimple(product.compareAtPrice)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            asChild
          >
            <Link href={`/products/${product.slug}`}>{viewProductLabel}</Link>
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAddingToCart}
            isLoading={isAddingToCart}
            aria-label={`${t("productDetail.addToCart")} ${productName}`}
          >
            {!isAddingToCart && (
              <>
                <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                {isOutOfStock ? t("productDetail.stock.outOfStock") : t("productDetail.addToCart")}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
