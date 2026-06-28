"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product, Coupon } from "@/types";
import { calculateCartSummary } from "@/utils";
import { logger } from "@/lib/logger";

// تعريف واجهة الحالة والعمليات لمتجر السلة (Cart State)
interface CartState {
  items: CartItem[];            // قائمة المنتجات المضافة في السلة
  coupon: Coupon | undefined;   // كوبون الخصم النشط إن وجد
  isOpen: boolean;              // حالة فتح/إغلاق القائمة الجانبية للسلة

  // العمليات (Actions)
  addItem: (product: Product, quantity?: number) => void;         // إضافة منتج للسلة
  removeItem: (productId: string) => void;                        // إزالة منتج من السلة
  updateQuantity: (productId: string, quantity: number) => void;  // تحديث كمية منتج معين
  clearCart: () => void;                                          // إفراغ السلة بالكامل
  applyCoupon: (coupon: Coupon) => void;                          // تطبيق كوبون خصم
  removeCoupon: () => void;                                       // إزالة كوبون الخصم
  openCart: () => void;                                           // فتح قائمة السلة الجانبية
  closeCart: () => void;                                          // إغلاق قائمة السلة الجانبية
  toggleCart: () => void;                                         // تبديل حالة فتح/إغلاق السلة

  // المحددات والدوال الحسابية (Selectors)
  getItemCount: () => number;                                                  // الحصول على عدد المنتجات الإجمالي
  getSummary: () => ReturnType<typeof calculateCartSummary>;                  // حساب وتلخيص المجموع والخصم والشحن
  getItemQuantity: (productId: string) => number;                              // الحصول على كمية منتج محدد في السلة
}

/**
 * متجر السلة الرئيسي باستخدام zustand مع تفعيل خاصية الحفظ التلقائي في localStorage (Persist).
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: undefined,
      isOpen: false,

      // دالة إضافة منتج أو زيادة كميته إن كان موجوداً مسبقاً
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // تحديث الكمية للمنتج الموجود مسبقاً (الحد الأقصى 99 قطعة)
            const updatedItems = state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
                : item
            );
            logger.info("Cart: quantity updated", { productId: product.id });
            return { items: updatedItems, isOpen: true };
          }

          // إضافة منتج جديد تماماً إلى قائمة السلة
          logger.info("Cart: item added", { productId: product.id });
          return {
            items: [
              ...state.items,
              {
                product,
                quantity,
                addedAt: new Date().toISOString(),
              },
            ],
            isOpen: true,
          };
        });
      },

      // إزالة منتج من السلة بناءً على معرّفه الفريد
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
        logger.info("Cart: item removed", { productId });
      },

      // تحديث كمية منتج محدد أو حذفه إذا أصبحت الكمية صفر أو أقل
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, 99) }
              : item
          ),
        }));
      },

      // تفريغ السلة وحذف الكوبون
      clearCart: () => {
        set({ items: [], coupon: undefined });
        logger.info("Cart: cleared");
      },

      // تطبيق كوبون خصم على المجموع
      applyCoupon: (coupon) => {
        set({ coupon });
        logger.info("Cart: coupon applied", { code: coupon.code });
      },

      // إزالة كوبون الخصم النشط
      removeCoupon: () => {
        set({ coupon: undefined });
      },

      // فتح وإغلاق السلة
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // الحصول على عدد القطع الإجمالي المضافة للسلة
      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      // حساب وعرض ملخص مبالغ السلة الإجمالية
      getSummary: () => {
        const { items, coupon } = get();
        return calculateCartSummary(items, coupon?.discount ?? 0);
      },

      // الحصول على كمية منتج محدد في السلة
      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.product.id === productId);
        return item?.quantity ?? 0;
      },
    }),
    {
      name: "luxetan-cart", // اسم المفتاح في localStorage
      storage: createJSONStorage(() => localStorage),
      // حفظ عناصر السلة والكوبون فقط وتجاهل حالة فتح/إغلاق النافذة الجانبية لتفادي إزعاج المستخدم عند إعادة تحميل الصفحة
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
);
