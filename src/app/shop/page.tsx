"use client";

import { useState, useMemo, startTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, RefreshCw, X } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from "@/constants";
import { MOCK_PRODUCTS } from "@/lib/mockData";
import type { ProductCategory, SortOption } from "@/types";
import { useTranslation } from "@/utils/i18n";
import { formatPriceSimple } from "@/utils";

/**
 * صفحة المتجر (ShopPage)
 * تعرض المنتجات بطريقة منسقة، وتتيح للمستخدم إمكانية تصفية المنتجات حسب الفئات،
 * الأسعار، التقييمات، وتدعم الفرز والترتيب التصاعدي والتنازلي.
 */
export default function ShopPage() {
  // حالات التحكم بفلاتر التصفية والفرز
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedSort, setSelectedSort] = useState<SortOption>("featured");
  const [priceRange, setPriceRange] = useState<number>(100);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false); // إظهار فلاتر الموبايل
  const { t } = useTranslation();

  // معالجة تصفية وترتيب المنتجات ديناميكياً لتجنب العمليات الحسابية المكررة
  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    // التصفية حسب الفئة
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // التصفية حسب الحد الأقصى للسعر
    result = result.filter((p) => p.price <= priceRange);

    // التصفية حسب الحد الأدنى للتقييم
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // ترتيب وفرز النتائج
    switch (selectedSort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // الترتيب الافتراضي (المنتجات المميزة أولاً)
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [selectedCategory, selectedSort, priceRange, minRating]);

  // دالة إعادة تعيين الفلاتر إلى قيمها الافتراضية
  const resetFilters = () => {
    startTransition(() => {
      setSelectedCategory("all");
      setSelectedSort("featured");
      setPriceRange(100);
      setMinRating(0);
    });
  };

  // دالة جلب الاسم المترجم للفئات من ملف الترجمة
  const getTranslatedCategory = (catVal: string, defaultLabel: string) => {
    const key = `shop.categories.${catVal}`;
    const trans = t(key);
    return trans !== key ? trans : defaultLabel;
  };

  // دالة جلب النص المترجم لخيارات الترتيب
  const getTranslatedSort = (sortVal: string, defaultLabel: string) => {
    const key = `shop.sort.${sortVal}`;
    const trans = t(key);
    return trans !== key ? trans : defaultLabel;
  };

  return (
    <div className="bg-cream/40 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ترويسة الصفحة */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-black">{t("shop.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("shop.description")}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* الشريط الجانبي للفلاتر — يظهر فقط على الشاشات الكبيرة */}
          <aside className="hidden lg:block space-y-6">
            <div className="rounded-3xl border border-beige bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-beige pb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-golden" />
                  {t("shop.filters.title")}
                </h2>
                <button
                  onClick={resetFilters}
                  className="text-xs text-muted-foreground hover:text-golden transition-colors"
                >
                  {t("shop.filters.reset")}
                </button>
              </div>

              {/* قسم تصفية الفئات */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">{t("shop.filters.categories")}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`block w-full text-left px-3 py-1.5 rounded-xl text-sm transition-all ${
                      selectedCategory === "all"
                        ? "bg-golden text-black font-semibold"
                        : "hover:bg-cream hover:text-golden"
                    }`}
                  >
                    {t("shop.filters.all")}
                  </button>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`block w-full text-left px-3 py-1.5 rounded-xl text-sm transition-all ${
                        selectedCategory === cat.value
                          ? "bg-golden text-black font-semibold"
                          : "hover:bg-cream hover:text-golden"
                      }`}
                    >
                      {getTranslatedCategory(cat.value, cat.label)}
                    </button>
                  ))}
                </div>
              </div>

              {/* قسم شريط تصفية السعر */}
              <div className="mb-6">
                <div className="flex justify-between text-sm font-semibold mb-3">
                  <h3>{t("shop.filters.maxPrice")}</h3>
                  <span className="text-golden">{formatPriceSimple(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-golden cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{formatPriceSimple(10)}</span>
                  <span>{formatPriceSimple(150)}</span>
                </div>
              </div>

              {/* قسم تصفية التقييمات بالنجوم */}
              <div>
                <h3 className="text-sm font-semibold mb-3">{t("shop.filters.minRating")}</h3>
                <div className="space-y-1.5">
                  {[4.8, 4.5, 4.0].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`flex w-full items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all ${
                        minRating === rating
                          ? "bg-cream border border-golden text-golden font-semibold"
                          : "hover:bg-cream border border-transparent"
                      }`}
                    >
                      <span>{t("shop.filters.ratingUp").replace("{rating}", rating.toFixed(1))}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* الكتالوج الرئيسي وقائمة المنتجات */}
          <main className="lg:col-span-3 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-beige bg-white px-6 py-4 shadow-sm">
              <p className="text-sm text-muted-foreground">
                {t("shop.showing").replace("{count}", String(filteredProducts.length))}
              </p>

              <div className="flex items-center gap-3">
                {/* زر الفتح لفلاتر الهواتف */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden flex items-center gap-2"
                  onClick={() => setShowFiltersMobile(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("shop.filters.title")}
                </Button>

                {/* قائمة الترتيب والفرز */}
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as SortOption)}
                  className="rounded-xl border border-beige bg-white px-3 py-1.5 text-sm font-medium outline-none focus:border-golden cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {getTranslatedSort(opt.value, opt.label)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* شبكة عرض كروت المنتجات */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              /* واجهة عدم العثور على أي منتج يطابق الفلاتر */
              <div className="rounded-3xl border border-dashed border-beige bg-white py-20 text-center">
                <p className="font-semibold text-lg">{t("shop.noProducts")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("shop.noProductsDesc")}
                </p>
                <Button variant="outline" className="mt-4" onClick={resetFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("shop.resetButton")}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* نافذة الفلاتر المنبثقة للهواتف المحمولة */}
      <AnimatePresence>
        {showFiltersMobile && (
          <>
            {/* خلفية معتمة لإغلاق النافذة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersMobile(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            {/* القائمة المنزلقة من اليسار */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-full max-w-xs bg-white p-6 shadow-2xl overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-beige">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-golden" />
                  {t("shop.filters.title")}
                </h2>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="p-1 rounded-full hover:bg-cream"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* عناصر التصفية للهواتف */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3">{t("shop.filters.categories")}</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className={`block w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                        selectedCategory === "all" ? "bg-golden text-black font-semibold" : "hover:bg-cream"
                      }`}
                    >
                      {t("shop.filters.all")}
                    </button>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`block w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                          selectedCategory === cat.value ? "bg-golden text-black font-semibold" : "hover:bg-cream"
                        }`}
                      >
                        {getTranslatedCategory(cat.value, cat.label)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-semibold mb-3">
                    <h3>{t("shop.filters.maxPrice")}</h3>
                    <span className="text-golden">{formatPriceSimple(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-golden cursor-pointer"
                  />
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full mb-2" onClick={resetFilters}>
                    {t("shop.filters.reset")}
                  </Button>
                  <Button className="w-full" onClick={() => setShowFiltersMobile(false)}>
                    {t("shop.filters.apply")}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
