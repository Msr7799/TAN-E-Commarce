"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Minus, Plus, Trash2, Tag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useCurrency } from "@/utils";
import { useTranslation } from "@/utils/i18n";
import { trackBeginCheckout } from "@/lib/analytics";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSummary } = useCartStore();
  const { formatPrice } = useCurrency();
  const { t } = useTranslation();

  const summary = getSummary();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
            role="dialog"
            aria-label={t("cartDrawer.title")}
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-beige px-6 py-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-golden" />
                <h2 className="text-lg font-bold">
                  {t("cartDrawer.title")}
                  {items.length > 0 && (
                    <span className="text-muted-foreground ml-2 text-sm font-normal">
                      {t("cartDrawer.itemsCount", { count: items.length, plural: items.length })}
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream"
                aria-label={t("cartDrawer.close")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping message */}
            {items.length > 0 && (
              <div className="border-b border-beige bg-cream px-6 py-3">
                <p className="text-xs font-semibold text-emerald-600">
                  🎉 {t("cartDrawer.shippingFreeSuccess")}
                </p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center gap-4 py-20 text-center"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
                      <ShoppingBag className="h-10 w-10 text-golden/40" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{t("cartDrawer.emptyTitle")}</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {t("cartDrawer.emptyDesc")}
                      </p>
                    </div>
                    <Button onClick={closeCart} asChild>
                      <Link href="/shop">{t("cartDrawer.shopNow")}</Link>
                    </Button>
                  </motion.div>
                ) : (
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
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-4 px-6 py-4"
                        >
                          {/* Product image */}
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={closeCart}
                            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cream"
                            aria-label={itemName}
                          >
                            {(() => {
                              const image =
                                item.product.images.find((image) => image.isPrimary) ??
                                item.product.images[0];
                              return image?.url ? (
                                <Image
                                  src={image.url}
                                  alt={image.alt || itemName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-golden">
                                  {itemName.charAt(0)}
                                </span>
                              );
                            })()}
                          </Link>

                          {/* Details */}
                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={closeCart}
                              className="line-clamp-2 text-sm leading-tight font-semibold transition-colors hover:text-golden"
                            >
                              {itemName}
                            </Link>
                            <p className="text-sm font-bold text-golden">
                              {formatPrice(item.product.price)}
                            </p>

                            {/* Quantity controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-beige transition-colors hover:border-golden hover:text-golden"
                                aria-label={`${t("productDetail.quantity")} - ${itemName}`}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span
                                className="w-8 text-center text-sm font-semibold"
                                aria-label={`${t("productDetail.quantity")}: ${item.quantity}`}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-beige transition-colors hover:border-golden hover:text-golden"
                                aria-label={`${t("productDetail.quantity")} + ${itemName}`}
                              >
                                <Plus className="h-3 w-3" />
                              </button>

                              <button
                                onClick={() => removeItem(item.product.id)}
                                className="text-muted-foreground ml-auto flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-red-50 hover:text-red-500"
                                aria-label={`${t("cartPage.remove")} ${itemName}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </ul>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-beige px-6 py-5">
                {/* Coupon placeholder */}
                <button className="text-muted-foreground mb-4 flex w-full items-center gap-2 rounded-xl border border-dashed border-beige px-4 py-2.5 text-sm transition-colors hover:border-golden hover:text-golden">
                  <Tag className="h-4 w-4" />
                  {t("cartDrawer.addCoupon")}
                </button>

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cartPage.subtotal")}</span>
                    <span className="font-medium">{formatPrice(summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("cartPage.shipping")}</span>
                    <span className="font-medium">
                      {summary.shipping === 0 ? (
                        <span className="text-emerald-600">{t("cartPage.free")}</span>
                      ) : (
                        formatPrice(summary.shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-beige pt-2 text-base">
                    <span className="font-bold">{t("cartPage.total")}</span>
                    <span className="font-bold text-golden">{formatPrice(summary.total)}</span>
                  </div>
                </div>

                {/* Checkout button */}
                <Button
                  className="mt-4 w-full"
                  size="lg"
                  asChild
                  onClick={() => {
                    closeCart();
                    trackBeginCheckout(summary.total, "USD");
                  }}
                >
                  <Link href="/cart">
                    {t("cartPage.checkout")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="ghost" className="mt-2 w-full text-sm" onClick={closeCart}>
                  {t("cartDrawer.continue")}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
