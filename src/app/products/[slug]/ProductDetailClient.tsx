"use client";

// ============================================================
// ProductDetailClient — interactive client layout for detail page
// ============================================================
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ShoppingBag,
  Heart,
  Share2,
  Plus,
  Minus,
  Check,
  Truck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { ProductCard } from "@/components/shared/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPriceSimple, getStockLabel, cn } from "@/utils";
import type { Product } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");
  const [isCopied, setIsCopied] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useTranslation();

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);
  const stockInfo = getStockLabel(product.stockStatus, product.stockCount);
  const isOutOfStock = product.stockStatus === "out_of_stock";

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      const copySuccessMsg = t("productDetail.toast.shareSuccess") !== "productDetail.toast.shareSuccess"
        ? t("productDetail.toast.shareSuccess")
        : "Link copied to clipboard!";
      toast.success(copySuccessMsg);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      const copyFailMsg = t("productDetail.toast.shareFail") !== "productDetail.toast.shareFail"
        ? t("productDetail.toast.shareFail")
        : "Failed to copy link.";
      toast.error(copyFailMsg);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    addItem(product, quantity);
    const addedMsg = t("productDetail.toast.added") !== "productDetail.toast.added"
      ? t("productDetail.toast.added").replace("{quantity}", String(quantity)).replace("{name}", productName)
      : `Added ${quantity} ${productName} to cart!`;
    toast.success(addedMsg);
    await new Promise((r) => setTimeout(r, 600));
    setIsAdding(false);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    // Directly close details and open cart drawer
    useCartStore.getState().openCart();
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

  const translatedDesc = t(`products.${product.id}.description`);
  const productDesc = translatedDesc !== `products.${product.id}.description` ? translatedDesc : product.description;

  const translatedShortDesc = t(`products.${product.id}.shortDescription`);
  const productShortDesc = translatedShortDesc !== `products.${product.id}.shortDescription` ? translatedShortDesc : product.shortDescription;

  const newLabel = t("productDetail.new") !== "productDetail.new" ? t("productDetail.new") : "New";

  return (
    <div className="bg-cream/20 min-h-screen py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-muted-foreground" role="list">
            <li>
              <Link href="/" className="hover:text-golden transition-colors">
                {t("productDetail.breadcrumbHome")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="hover:text-golden transition-colors">
                {t("productDetail.breadcrumbShop")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-black font-semibold truncate" aria-current="page">
              {productName}
            </li>
          </ol>
        </nav>

        {/* Main Product Layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Gallery Placeholder */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-beige bg-gradient-to-br from-cream via-beige/30 to-beige shadow-lg"
            >
              {/* Product Placeholder Display */}
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-golden/10 shadow-inner">
                    <span className="text-5xl font-bold text-golden">
                      {productName.charAt(0)}
                    </span>
                  </div>
                  <div className="px-6">
                    <span className="inline-block rounded-full bg-black/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {product.category.replace("-", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Float badges */}
              <div className="absolute left-6 top-6 flex flex-col gap-2">
                {product.isNew && <Badge variant="new">{newLabel}</Badge>}
                {product.discount && <Badge variant="golden">-{product.discount}%</Badge>}
              </div>
            </motion.div>
          </div>

          {/* Right: Product Details Info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className={cn("text-sm font-semibold", stockInfo.color)}>
                {getTranslatedStockLabel()}
              </span>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
                {productName}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">{t("productDetail.sku")}: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-golden">
                {formatPriceSimple(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPriceSimple(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Description intro */}
            <p className="text-base leading-relaxed text-muted-foreground">
              {productShortDesc}
            </p>

            {/* Customizer: Quantity selector & action buttons */}
            <div className="border-y border-beige py-6 space-y-4">
              <div className="flex items-center gap-6">
                <span className="text-sm font-semibold">{t("productDetail.quantity")}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-beige hover:border-golden hover:text-golden transition-colors disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-beige hover:border-golden hover:text-golden transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  className="flex-1 min-w-[200px]"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                  isLoading={isAdding}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {t("productDetail.addToCart")}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1 min-w-[200px]"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  {t("productDetail.buyNow")}
                </Button>

                {/* Wishlist & Share */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleItem(product.id)}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border transition-all",
                      inWishlist
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-beige bg-white text-muted-foreground hover:border-red-200 hover:text-red-500"
                    )}
                    aria-label={inWishlist ? t("productDetail.wishlistRemove") : t("productDetail.wishlistAdd")}
                  >
                    <Heart className="h-5 w-5" fill={inWishlist ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-beige bg-white text-muted-foreground hover:border-golden hover:text-golden transition-all"
                    aria-label={t("productDetail.share")}
                  >
                    {isCopied ? <Check className="h-5 w-5 text-emerald-500" /> : <Share2 className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Accordion Specs / Info tabs */}
            <div className="space-y-4">
              <div className="flex border-b border-beige">
                <button
                  onClick={() => setActiveTab("description")}
                  className={cn(
                    "px-4 py-2.5 text-sm font-semibold border-b-2 transition-all",
                    activeTab === "description"
                      ? "border-golden text-golden"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t("productDetail.tabs.details")}
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={cn(
                    "px-4 py-2.5 text-sm font-semibold border-b-2 transition-all",
                    activeTab === "specs"
                      ? "border-golden text-golden"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t("productDetail.tabs.specs")}
                </button>
              </div>

              <div className="py-2 text-sm leading-relaxed text-muted-foreground min-h-[120px]">
                {activeTab === "description" ? (
                  <div className="space-y-4">
                    <p>{productDesc}</p>
                    <div className="flex flex-col gap-2 pt-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-golden" />
                        <span>{t("productDetail.shippingAlert").replace("{threshold}", formatPriceSimple(FREE_SHIPPING_THRESHOLD))}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4 text-golden" />
                        <span>{t("productDetail.guarantee")}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      {product.specifications.map((spec) => (
                        <tr key={spec.label} className="border-b border-beige/60">
                          <td className="py-2.5 font-semibold text-foreground w-1/3">{spec.label}</td>
                          <td className="py-2.5">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 border-t border-beige pt-16">
            <h2 className="mb-10 text-2xl font-bold text-black text-center sm:text-left">
              {t("productDetail.related")}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
