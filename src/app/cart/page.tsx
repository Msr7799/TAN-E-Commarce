"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatPriceSimple } from "@/utils";
import { FREE_SHIPPING_THRESHOLD } from "@/constants";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getSummary,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();
  const { t } = useTranslation();

  const [couponCode, setCouponCode] = useState("");

  const summary = getSummary();
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - summary.subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === "LUXETAN20") {
      applyCoupon({
        code: "LUXETAN20",
        discount: 20,
        type: "percentage",
        isValid: true,
      });
      const successMsg = t("cartPage.toast.couponSuccess") !== "cartPage.toast.couponSuccess"
        ? t("cartPage.toast.couponSuccess")
        : "Coupon code applied successfully! 20% Off!";
      toast.success(successMsg);
      setCouponCode("");
    } else {
      const failMsg = t("cartPage.toast.couponFail") !== "cartPage.toast.couponFail"
        ? t("cartPage.toast.couponFail")
        : "Invalid coupon code. Try LUXETAN20";
      toast.error(failMsg);
    }
  };

  return (
    <div className="bg-cream/20 min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-black mb-10 text-center sm:text-left">
          {t("cartPage.title")}
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center gap-6 py-20 text-center rounded-3xl border border-dashed border-beige bg-white p-8"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream">
              <ShoppingBag className="h-12 w-12 text-golden/40" />
            </div>
            <div>
              <h2 className="font-bold text-xl">{t("cartPage.emptyTitle")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("cartPage.emptyDesc")}
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/shop">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("cartPage.goToShop")}
              </Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left: Cart Items list */}
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-3xl border border-beige bg-white shadow-sm overflow-hidden">
                <ul className="divide-y divide-beige" role="list">
                  {items.map((item) => {
                    const translatedItemName = t(`products.${item.product.id}.name`);
                    const itemName = translatedItemName !== `products.${item.product.id}.name` ? translatedItemName : item.product.name;
                    return (
                      <motion.li
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col sm:flex-row gap-4 p-6"
                      >
                        {/* Image placeholder */}
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-golden/20 to-amber-100 mx-auto sm:mx-0"
                        >
                          <span className="text-3xl font-bold text-golden">
                            {itemName.charAt(0)}
                          </span>
                        </Link>

                        {/* Content */}
                        <div className="flex flex-1 flex-col gap-2 min-w-0">
                          <div className="flex justify-between gap-4">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-bold leading-snug hover:text-golden transition-colors line-clamp-2"
                            >
                              {itemName}
                            </Link>
                            <span className="font-extrabold text-golden shrink-0">
                              {formatPriceSimple(item.product.price)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground capitalize">
                            {t("cartPage.category")}: {getTranslatedCategory(item.product.category, item.product.category.replace("-", " "))}
                          </p>

                          {/* Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-beige hover:border-golden hover:text-golden transition-colors"
                                aria-label={`${t("productDetail.quantity")} - ${itemName}`}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center font-semibold text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-beige hover:border-golden hover:text-golden transition-colors"
                                aria-label={`${t("productDetail.quantity")} + ${itemName}`}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors"
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

              {/* Shopping navigation */}
              <div className="flex justify-between items-center px-2">
                <Button variant="ghost" asChild>
                  <Link href="/shop" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    {t("cartPage.continue")}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4 space-y-6">
              {/* Shipping alert */}
              <div className="rounded-3xl border border-beige bg-white p-6 shadow-sm">
                {freeShippingRemaining > 0 ? (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("cartPage.shippingFreeAlert").replace("{amount}", formatPriceSimple(freeShippingRemaining))}
                    </p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream border border-beige">
                      <div
                        className="h-full rounded-full bg-golden transition-all duration-300"
                        style={{ width: `${Math.min((summary.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-emerald-600">
                    🎉 {t("cartPage.shippingFreeSuccess")}
                  </p>
                )}
              </div>

              {/* Order total card */}
              <div className="rounded-3xl border border-beige bg-white p-6 shadow-sm space-y-6">
                <h2 className="font-bold text-lg border-b border-beige pb-4">{t("cartPage.summaryTitle")}</h2>

                {/* Subtotal details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cartPage.subtotal")}</span>
                    <span className="font-medium text-black">
                      {formatPriceSimple(summary.subtotal)}
                    </span>
                  </div>

                  {coupon && (
                    <div className="flex justify-between text-emerald-600">
                      <span className="flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5" />
                        {t("cartPage.discount")} ({coupon.code})
                      </span>
                      <span>-{formatPriceSimple(summary.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cartPage.shipping")}</span>
                    <span className="font-medium text-black">
                      {summary.shipping === 0 ? (
                        <span className="text-emerald-600 font-semibold">{t("cartPage.free")}</span>
                      ) : (
                        formatPriceSimple(summary.shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-beige pt-4 text-base font-bold">
                    <span>{t("cartPage.total")}</span>
                    <span className="text-golden">{formatPriceSimple(summary.total)}</span>
                  </div>
                </div>

                {/* Coupon entry form */}
                {!coupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t("cartPage.couponPlaceholder")}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 rounded-xl border border-beige px-3 py-2 text-sm outline-none focus:border-golden placeholder:text-muted-foreground uppercase"
                    />
                    <Button type="submit" variant="outline" size="sm">
                      {t("cartPage.couponApply")}
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-2.5 text-sm text-emerald-700">
                    <span className="font-semibold">{t("cartPage.couponApplied").replace("{code}", coupon.code)}</span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs underline hover:text-emerald-900 transition-colors"
                    >
                      {t("cartPage.remove")}
                    </button>
                  </div>
                )}

                {/* Proceed button */}
                <Button className="w-full" size="lg" onClick={() => {
                  const checkMsg = t("cartPage.toast.checkoutSuccess") !== "cartPage.toast.checkoutSuccess"
                    ? t("cartPage.toast.checkoutSuccess")
                    : "Checkout simulation successful!";
                  toast.success(checkMsg);
                }}>
                  {t("cartPage.checkout")}
                  <ArrowRight className="h-4.5 w-4.5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function getTranslatedCategory(catVal: string, defaultLabel: string) {
    const key = `shop.categories.${catVal}`;
    const trans = t(key);
    return trans !== key ? trans : defaultLabel;
  }
}
