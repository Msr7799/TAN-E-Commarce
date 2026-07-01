"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useCurrency } from "@/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";
import { trackPurchase } from "@/lib/analytics";

/**
 * صفحة السلة التفصيلية (CartPage)
 * تعرض تفاصيل المنتجات المضافة للسلة، وتتيح إمكانية زيادة/نقصان الكميات،
 * حذف المنتجات، تطبيق قسائم الخصم، وعرض شريط تقدم الشحن المجاني وحساب المجموع الكلي.
 */
export default function CartPage() {
  // استدعاء قيم متجر السلة وحالتها العامة
  const { items, removeItem, updateQuantity, getSummary, coupon, applyCoupon, removeCoupon } =
    useCartStore();
  const pathname = usePathname();
  const { t } = useTranslation();

  // حالة محلية لإدخال كود كوبون الخصم من قبل المستخدم
  const [couponCode, setCouponCode] = useState("");

  // جلب ملخص السلة
  const { formatPrice } = useCurrency();
  const summary = getSummary();

  // دالة التحقق وتطبيق الكوبون
  const handleCheckout = () => {
    if (items.length === 0) return;

    const orderId = `order-${items.map((item) => `${item.product.id}:${item.quantity}`).join("-")}`;

    trackPurchase({
      id: orderId,
      total: summary.total,
      currency: "USD",
    });

    toast.success(t("cartPage.checkoutSuccess") || "Checkout simulation successful!");
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    // التحقق من صحة الكوبون (افتراضياً ندعم الكود Marbella20 ليعطي خصم 20%)
    if (clean === "Marbella20") {
      applyCoupon({
        code: "Marbella20",
        discount: 20,
        type: "percentage",
        isValid: true,
      });
      const successMsg =
        t("cartPage.toast.couponSuccess") !== "cartPage.toast.couponSuccess"
          ? t("cartPage.toast.couponSuccess")
          : "Coupon code applied successfully! 20% Off!";
      toast.success(successMsg);
      setCouponCode("");
    } else {
      const failMsg =
        t("cartPage.toast.couponFail") !== "cartPage.toast.couponFail"
          ? t("cartPage.toast.couponFail")
          : "Invalid coupon code. Try Marbella20";
      toast.error(failMsg);
    }
  };

  return (
    <div className="min-h-screen bg-cream/20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* عنوان الصفحة الرئيسي */}
        <h1 className="mb-4 text-center text-3xl font-bold tracking-tight text-black sm:text-left">
          {t("cartPage.title")}
        </h1>
        <p className="text-muted-foreground mb-10 text-center text-sm sm:text-left">
          {t("cartPage.currentRoute", { route: pathname }) || `Current route: ${pathname}`}
        </p>

        {items.length === 0 ? (
          /* واجهة السلة الفارغة */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-beige bg-white p-8 py-20 text-center"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream">
              <ShoppingBag className="h-12 w-12 text-golden/40" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t("cartPage.emptyTitle")}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{t("cartPage.emptyDesc")}</p>
            </div>
            <Button size="lg" asChild>
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("cartPage.goToShop")}
              </Link>
            </Button>
          </motion.div>
        ) : (
          /* واجهة السلة المحملة بالمنتجات */
          <div className="grid gap-10 lg:grid-cols-12">
            {/* القسم الأيمن: قائمة عناصر السلة */}
            <div className="space-y-6 lg:col-span-8">
              <div className="overflow-hidden rounded-3xl border border-beige bg-white shadow-sm">
                <ul className="divide-y divide-beige" role="list">
                  {items.map((item) => {
                    const translatedItemName = t(`products.${item.product.id}.name`);
                    const itemName =
                      translatedItemName !== `products.${item.product.id}.name`
                        ? translatedItemName
                        : item.product.name;
                    return (
                      <motion.li
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-4 p-6 sm:flex-row"
                      >
                        {/* صورة المنتج المصغرة */}
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-golden/20 to-amber-100 sm:mx-0"
                        >
                          <span className="text-3xl font-bold text-golden">
                            {itemName.charAt(0)}
                          </span>
                        </Link>

                        {/* تفاصيل الاسم والسعر والتحكم */}
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="flex justify-between gap-4">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="line-clamp-2 leading-snug font-bold transition-colors hover:text-golden"
                            >
                              {itemName}
                            </Link>
                            <span className="shrink-0 font-extrabold text-golden">
                              {formatPrice(item.product.price)}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs capitalize">
                            {t("cartPage.category")}:{" "}
                            {getTranslatedCategory(
                              item.product.category,
                              item.product.category.replace("-", " ")
                            )}
                          </p>

                          {/* أزرار تعديل الكمية وحذف العنصر */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-beige transition-colors hover:border-golden hover:text-golden"
                                aria-label={`${t("productDetail.quantity")} - ${itemName}`}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-beige transition-colors hover:border-golden hover:text-golden"
                                aria-label={`${t("productDetail.quantity")} + ${itemName}`}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-muted-foreground flex items-center gap-1 text-sm transition-colors hover:text-red-500"
                              aria-label={`${t("cartPage.remove")} ${itemName}`}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="hidden sm:inline">{t("cartPage.remove")}</span>
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>

              {/* زر العودة للمتجر */}
              <div className="flex items-center justify-between px-2">
                <Button variant="ghost" asChild>
                  <Link href="/shop" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t("cartPage.continue")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* القسم الأيسر: ملخص الطلب والخصومات والجمارك */}
            <div className="space-y-6 lg:col-span-4">
              {/* التنبيه بخصوص الشحن المجاني */}
              <div className="rounded-3xl border border-beige bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-emerald-600">
                  🎉 {t("cartPage.shippingFreeSuccess")}
                </p>
              </div>

              {/* ملخص الحساب النهائي للطلب */}
              <div className="space-y-6 rounded-3xl border border-beige bg-white p-6 shadow-sm">
                <h2 className="border-b border-beige pb-4 text-lg font-bold">
                  {t("cartPage.summaryTitle")}
                </h2>

                {/* تفاصيل المجموع الفرعي والخصومات والشحن */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cartPage.subtotal")}</span>
                    <span className="font-medium text-black">{formatPrice(summary.subtotal)}</span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-emerald-600">
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        {t("cartPage.discount")} ({coupon.code})
                      </span>
                      <span>-{formatPrice(summary.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cartPage.shipping")}</span>
                    <span className="font-medium text-black">
                      {summary.shipping === 0 ? (
                        <span className="font-semibold text-emerald-600">{t("cartPage.free")}</span>
                      ) : (
                        formatPrice(summary.shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-beige pt-4 text-base font-bold">
                    <span>{t("cartPage.total")}</span>
                    <span className="text-golden">{formatPrice(summary.total)}</span>
                  </div>
                </div>

                {/* نموذج إدخال الكوبون */}
                {!coupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t("cartPage.couponPlaceholder")}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="placeholder:text-muted-foreground flex-1 rounded-xl border border-beige px-3 py-2 text-sm uppercase outline-none focus:border-golden"
                    />
                    <Button type="submit" variant="outline" size="sm">
                      {t("cartPage.couponApply")}
                    </Button>
                  </form>
                ) : (
                  /* عرض تفاصيل الكوبون النشط وإزالته */
                  <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
                    <span className="font-semibold">
                      {t("cartPage.couponApplied").replace("{code}", coupon.code)}
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs underline transition-colors hover:text-emerald-900"
                    >
                      {t("cartPage.remove")}
                    </button>
                  </div>
                )}

                {/* زر الدفع النهائي */}
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  {t("cartPage.checkout")}
                  <ArrowRight className="ml-2 h-4.5 w-4.5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // دالة مساعدة لترجمة مسار فئة المنتج وعرض التسمية المترجمة المقابلة
  function getTranslatedCategory(catVal: string, defaultLabel: string) {
    const key = `shop.categories.${catVal}`;
    const trans = t(key);
    return trans !== key ? trans : defaultLabel;
  }
}
