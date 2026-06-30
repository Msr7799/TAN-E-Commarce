"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

// Three.js / WebGL — loaded only on client to avoid SSR errors
const Product3DViewer = dynamic(() => import("@/components/shared/Product3DViewer"), {
  ssr: false,
  loading: () => <div className="aspect-[4/5] w-full animate-pulse rounded bg-[#f4f2ef]" />,
});
import { motion } from "motion/react";
import { ShoppingBag, Heart, Share2, Plus, Minus, Check, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { ProductCard } from "@/components/shared/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { getStockLabel, useCurrency, cn } from "@/utils";
import type { Product } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";
import type { ProductImage } from "@/types";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

/**
 * صفحة تفاصيل المنتج (ProductDetailClient)
 * تعرض معلومات شاملة عن منتج محدد تشمل الصور والمخزون، التقييم، الوصف التفصيلي،
 * والمواصفات الفنية، مع إتاحة خيارات الإضافة للسلة أو الشراء المباشر.
 */
export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const primaryImage = product.images.find((image) => image.isPrimary) ?? product.images[0];
  const detailImages: ProductImage[] = [
    ...(primaryImage ? [primaryImage] : []),
    ...product.images.filter((image) => image.url !== primaryImage?.url),
    ...(product.hoverImage ? [product.hoverImage] : []),
  ].filter((image, index, images) => images.findIndex((item) => item.url === image.url) === index);

  // حالات التحكم بالكمية المحددة والتبويب النشط (الوصف / المواصفات)
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");
  const [selectedImageUrl, setSelectedImageUrl] = useState(detailImages[0]?.url ?? "");
  const [isCopied, setIsCopied] = useState(false); // حالة نسخ رابط المنتج لمشاركته
  const [isAdding, setIsAdding] = useState(false); // حالة تحميل زر الإضافة إلى السلة
  const [show3D, setShow3D] = useState(false); // تبديل عرض الزجاجة ثلاثي الأبعاد
  const { t } = useTranslation();

  // دوال الإضافة للسلة والمفضلة
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { formatPrice } = useCurrency();
  const inWishlist = isInWishlist(product.id);
  const stockInfo = getStockLabel(product.stockStatus, product.stockCount);
  const isOutOfStock = product.stockStatus === "out_of_stock";

  // معالجة مشاركة رابط المنتج عبر نسخه للحافظة
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      const copySuccessMsg =
        t("productDetail.toast.shareSuccess") !== "productDetail.toast.shareSuccess"
          ? t("productDetail.toast.shareSuccess")
          : "Link copied to clipboard!";
      toast.success(copySuccessMsg);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      const copyFailMsg =
        t("productDetail.toast.shareFail") !== "productDetail.toast.shareFail"
          ? t("productDetail.toast.shareFail")
          : "Failed to copy link.";
      toast.error(copyFailMsg);
    }
  };

  // إضافة المنتج إلى السلة بالكمية المحددة
  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    addItem(product, quantity);
    const addedMsg =
      t("productDetail.toast.added") !== "productDetail.toast.added"
        ? t("productDetail.toast.added")
            .replace("{quantity}", String(quantity))
            .replace("{name}", productName)
        : `Added ${quantity} ${productName} to cart!`;
    toast.success(addedMsg);
    await new Promise((r) => setTimeout(r, 600));
    setIsAdding(false);
  };

  // الشراء المباشر الفوري (إضافة للسلة وفتح قائمة السلة الجانبية فوراً)
  const handleBuyNow = () => {
    addItem(product, quantity);
    useCartStore.getState().openCart();
  };

  // تنسيق وجلب حالة توفر المنتج من المخزن ومواءمتها مع اللغات
  const getTranslatedStockLabel = () => {
    if (product.stockStatus === "out_of_stock") {
      return t("productDetail.stock.outOfStock");
    }
    if (product.stockStatus === "low_stock" || product.stockCount <= 5) {
      return t("productDetail.stock.lowStock", { count: product.stockCount });
    }
    return t("productDetail.stock.inStock");
  };

  // استدعاء معلومات المنتج المترجمة (الاسم، الوصف، والوصف المختصر)
  const translatedName = t(`products.${product.id}.name`);
  const productName =
    translatedName !== `products.${product.id}.name` ? translatedName : product.name;

  const translatedDesc = t(`products.${product.id}.description`);
  const productDesc =
    translatedDesc !== `products.${product.id}.description` ? translatedDesc : product.description;

  const translatedShortDesc = t(`products.${product.id}.shortDescription`);
  const productShortDesc =
    translatedShortDesc !== `products.${product.id}.shortDescription`
      ? translatedShortDesc
      : product.shortDescription;

  const newLabel = t("productDetail.new") !== "productDetail.new" ? t("productDetail.new") : "New";
  const canShow3DViewer = [
    "bronze-tanning-oil",
    "coco-tanning-oil",
    "deer-blood-tanning-oil",
  ].includes(product.slug);
  const textureMap: Record<string, { front: string; back: string }> = {
    "bronze-tanning-oil": {
      front: "/brown-removebg.png",
      back: "/brown-back-removebg.png",
    },
    "coco-tanning-oil": {
      front: "/orange-removebg.png",
      back: "/orange-back-removebg.png",
    },
    "deer-blood-tanning-oil": {
      front: "/red-front-removebg.png",
      back: "/red-back-removebg.png",
    },
  };
  const selectedImage =
    detailImages.find((image) => image.url === selectedImageUrl) ?? detailImages[0];
  const currentTextures = textureMap[product.slug];

  return (
    <div className="min-h-screen bg-[#e9e6e2] py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* مسار الصفحة التتبعي (Breadcrumbs) */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="text-muted-foreground flex items-center gap-2" role="list">
            <li>
              <Link href="/" className="transition-colors hover:text-golden">
                {t("productDetail.breadcrumbHome")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/shop" className="transition-colors hover:text-golden">
                {t("productDetail.breadcrumbShop")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="truncate font-semibold text-black" aria-current="page">
              {productName}
            </li>
          </ol>
        </nav>

        {/* تصميم الصفحة الرئيسي */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-16">
          {/* القسم الأيمن: معرض صور المنتج أو العارض ثلاثي الأبعاد */}
          <div className="space-y-5">
            {show3D ? (
              /* ─── عارض 3D ─── */
              <Product3DViewer
                frontTextureUrl={currentTextures?.front}
                backTextureUrl={currentTextures?.back}
                productName={productName}
                liquidColor="#8B1A1A"
                height={520}
                onClose={() => setShow3D(false)}
              />
            ) : (
              /* ─── معرض الصور الاعتيادي ─── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-[4/5] w-full overflow-hidden border border-black/10 bg-[#f2f0ed] shadow-sm"
              >
                {selectedImage && (
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover"
                  />
                )}

                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {product.isNew && <Badge variant="new">{newLabel}</Badge>}
                  {product.discount && <Badge variant="golden">-{product.discount}%</Badge>}
                </div>

                {/* زر تفعيل العرض ثلاثي الأبعاد */}
                {canShow3DViewer && (
                  <button
                    id="toggle-3d-view"
                    onClick={() => setShow3D(true)}
                    className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full border border-stone-200 bg-white/90 px-4 py-2 text-xs font-semibold tracking-wider text-stone-700 shadow backdrop-blur transition-all hover:bg-white hover:text-red-700"
                    aria-label="عرض المنتج ثلاثي الأبعاد"
                  >
                    <span aria-hidden="true">⬡</span>
                    عرض ثلاثي الأبعاد
                  </button>
                )}
              </motion.div>
            )}

            {/* الصور المصغرة — تظهر دائماً تحت سواء 3D أو صورة */}
            {detailImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {detailImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => {
                      setSelectedImageUrl(image.url);
                      setShow3D(false); // العودة للصورة عند اختيار صورة مصغرة
                    }}
                    className={cn(
                      "relative aspect-[4/5] overflow-hidden border bg-[#f2f0ed] transition-all",
                      selectedImage?.url === image.url && !show3D
                        ? "border-black"
                        : "border-black/10 hover:border-black/40"
                    )}
                    aria-label={`Show ${image.alt}`}
                  >
                    <Image src={image.url} alt="" fill sizes="160px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* القسم الأيسر: معلومات المنتج، الأسعار، وأزرار التنفيذ */}
          <div className="flex flex-col gap-6 lg:pt-1">
            <div>
              <span className={cn("text-sm font-semibold", stockInfo.color)}>
                {getTranslatedStockLabel()}
              </span>
              <p className="mt-5 text-[11px] font-bold tracking-[0.22em] text-black/45 uppercase">
                Marbella Cosmetics
              </p>
              <h1 className="mt-2 text-4xl font-normal tracking-wide text-black uppercase sm:text-5xl">
                {productName}
              </h1>
              <p className="text-muted-foreground mt-1 text-xs">
                {t("productDetail.sku")}: {product.sku}
              </p>
            </div>

            {/* تقييم النجوم والآراء */}
            <div className="flex items-center gap-4">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>

            {/* الأسعار الفرعية والخصومات */}
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-golden">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-muted-foreground text-lg line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* وصف قصير */}
            <p className="text-muted-foreground text-base leading-relaxed">{productShortDesc}</p>

            <label className="grid gap-2 text-sm font-semibold">
              Size
              <select className="h-12 border border-black/35 bg-transparent px-4 text-sm font-normal outline-none focus:border-black">
                <option>100ml</option>
              </select>
            </label>

            {/* خيارات تحديد الكمية والأزرار */}
            <div className="space-y-4 border-y border-black/10 py-6">
              <div className="flex items-center gap-6">
                <span className="text-sm font-semibold">{t("productDetail.quantity")}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                    disabled={quantity <= 1}
                    className="flex h-10 w-10 items-center justify-center border border-black/35 transition-colors hover:border-black disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-lg font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-10 w-10 items-center justify-center border border-black/35 transition-colors hover:border-black"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* أزرار الإضافة والمفضلة والمشاركة */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  className="min-w-[200px] flex-1 rounded-none"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                  isLoading={isAdding}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  {t("productDetail.addToCart")}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  className="min-w-[200px] flex-1 rounded-none"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                >
                  {t("productDetail.buyNow")}
                </Button>

                <div className="flex gap-2">
                  {/* زر إضافة/حذف من المفضلة */}
                  <button
                    onClick={() => toggleItem(product.id)}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border transition-all",
                      inWishlist
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "text-muted-foreground border-black/20 bg-transparent hover:border-red-200 hover:text-red-500"
                    )}
                    aria-label={
                      inWishlist
                        ? t("productDetail.wishlistRemove")
                        : t("productDetail.wishlistAdd")
                    }
                  >
                    <Heart className="h-5 w-5" fill={inWishlist ? "currentColor" : "none"} />
                  </button>
                  {/* زر مشاركة رابط المنتج */}
                  <button
                    onClick={handleShare}
                    className="text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full border border-black/20 bg-transparent transition-all hover:border-golden hover:text-golden"
                    aria-label={t("productDetail.share")}
                  >
                    {isCopied ? (
                      <Check className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Share2 className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* تفاصيل المنتج ومواصفاته الفنية */}
            <div className="space-y-4">
              <div className="flex border-b border-black/10">
                <button
                  onClick={() => setActiveTab("description")}
                  className={cn(
                    "border-b-2 px-4 py-2.5 text-sm font-semibold transition-all",
                    activeTab === "description"
                      ? "border-golden text-golden"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  )}
                >
                  {t("productDetail.tabs.details")}
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={cn(
                    "border-b-2 px-4 py-2.5 text-sm font-semibold transition-all",
                    activeTab === "specs"
                      ? "border-golden text-golden"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  )}
                >
                  {t("productDetail.tabs.specs")}
                </button>
              </div>

              {/* محتوى تبويب الوصف أو المواصفات */}
              <div className="text-muted-foreground min-h-[120px] py-2 text-sm leading-relaxed">
                {activeTab === "description" ? (
                  <div className="space-y-4">
                    <div className="space-y-4 text-center whitespace-pre-line text-black/65 lg:text-right">
                      <p>{productDesc}</p>
                    </div>
                    <div className="flex flex-col gap-2 pt-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-golden" />
                        <span>{t("productDetail.shippingAlert")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4 text-golden" />
                        <span>{t("productDetail.guarantee")}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left">
                    <tbody>
                      {product.specifications.map((spec) => (
                        <tr key={spec.label} className="border-b border-beige/60">
                          <td className="text-foreground w-1/3 py-2.5 font-semibold">
                            {spec.label}
                          </td>
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

        {/* المنتجات ذات الصلة الموصى بها */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 border-t border-beige pt-16">
            <h2 className="mb-10 text-center text-2xl font-bold text-black sm:text-left">
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
