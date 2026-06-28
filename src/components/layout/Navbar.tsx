"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Search, Menu, X, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { NAV_LINKS } from "@/constants";
import { useTranslation } from "@/utils/i18n";
import { cn } from "@/utils";

/**
 * مكون شريط التنقل العلوي (Navbar)
 * يتميز بكونه ثابتاً (sticky) مع تأثير الضباب والشفافية عند التمرير،
 * ويحتوي على أزرار البحث، السلة، تبديل اللغة (عربي/إنجليزي)، وقائمة تفاعلية للهواتف المحمولة.
 */
export function Navbar() {
  const pathname = usePathname(); // تتبع المسار الحالي لتحديد الصفحة النشطة
  const [isScrolled, setIsScrolled] = useState(false); // حالة تتبع التمرير لتطبيق تأثير الخلفية
  const itemCount = useCartStore((s) => s.getItemCount()); // عدد العناصر المضافة للسلة
  const toggleCart = useCartStore((s) => s.toggleCart); // دالة فتح وإغلاق السلة الجانبية
  
  // استدعاء الحالات والعمليات العامة من متجر واجهة المستخدم (UI Store)
  const { isSearchOpen, toggleSearch, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useUIStore();
  const { t, locale, setLocale } = useTranslation();

  // دالة مراقبة التمرير لإضافة تأثير الضباب (backdrop-blur) بعد إزاحة 20 بكسل
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  // إضافة مستمع لحدث التمرير عند تركيب المكون وإزالته عند إلغاء التركيب لمنع تسرب الذاكرة
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // إغلاق قائمة الهواتف تلقائياً عند تغيير المسار والانتقال لصفحة أخرى
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/80 shadow-md shadow-black/5 backdrop-blur-xl"
            : "bg-white/0"
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* شعار الموقع مع حركة دوران خفيفة عند تمرير مؤشر الفأرة */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight" aria-label="go to homepage">
            <motion.div
              whileHover={{ rotate: 20 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-golden text-black"
            >
              <Sun className="h-4 w-4" aria-hidden="true" />
            </motion.div>
            <span className="bg-gradient-to-r from-golden to-amber-500 bg-clip-text text-transparent">
              {t("siteName")}
            </span>
          </Link>

          {/* روابط التنقل الرئيسية للشاشات الكبيرة */}
          <ul className="hidden items-center gap-1 md:flex" role="list">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors duration-200",
                      isActive ? "text-golden" : "text-foreground hover:text-golden"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {t(link.label)}
                    {/* مؤشر الصفحة النشطة السفلي مع حركة انتقال سلسة */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-golden"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* أيقونات وأزرار التحكم */}
          <div className="flex items-center gap-1">
            {/* مبدل لغة الموقع للشاشات المتوسطة والكبيرة */}
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={() => setLocale("en")}
                className={cn(
                  "px-2 py-1 text-sm font-semibold transition-colors hover:text-golden",
                  locale === "en" ? "text-golden underline decoration-2 underline-offset-4" : "text-foreground"
                )}
                aria-label="Switch to English"
              >
                EN
              </button>
              <span className="text-beige/60 text-xs">|</span>
              <button
                onClick={() => setLocale("ar")}
                className={cn(
                  "px-2 py-1 text-sm font-semibold transition-colors hover:text-golden",
                  locale === "ar" ? "text-golden underline decoration-2 underline-offset-4" : "text-foreground"
                )}
                aria-label="التبديل إلى العربية"
              >
                AR
              </button>
            </div>

            {/* زر البحث المنبثق */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-cream hover:text-golden"
              aria-label={t("actions.search")}
              aria-expanded={isSearchOpen}
            >
              <Search className="h-5 w-5" />
            </motion.button>

            {/* زر السلة مع شارة توضح عدد العناصر المضافة */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-cream hover:text-golden"
              aria-label={t("actions.cart", { count: itemCount, plural: itemCount })}
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-golden text-[10px] font-bold text-black"
                    aria-hidden="true"
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* زر القائمة الجانبية المخصص للهواتف المحمولة */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-cream hover:text-golden md:hidden"
              aria-label={isMobileMenuOpen ? t("actions.closeMenu") : t("actions.openMenu")}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* لوحة القائمة المخصصة للهواتف المحمولة */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* خلفية سوداء شبه شفافة تغطي بقية الصفحة */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* محتوى القائمة المنزلقة من اليمين */}
            <motion.nav
              id="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 flex w-72 flex-col bg-white shadow-2xl md:hidden"
              aria-label="Mobile navigation"
            >
              {/* ترويسة قائمة الهاتف */}
              <div className="flex items-center justify-between border-b border-beige px-6 py-4">
                <span className="font-bold text-lg text-golden">{t("siteName")}</span>
                <button
                  onClick={closeMobileMenu}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-cream"
                  aria-label={t("actions.closeMenu")}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* روابط التنقل في قائمة الهاتف */}
              <ul className="flex flex-col gap-1 p-4" role="list">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center rounded-xl px-4 py-3 text-base font-medium transition-colors",
                        pathname === link.href
                          ? "bg-cream text-golden"
                          : "hover:bg-cream hover:text-golden"
                      )}
                      aria-current={pathname === link.href ? "page" : undefined}
                    >
                      {t(link.label)}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* مبدل لغة متجاوب لنسخة الهواتف المحمولة */}
              <div className="border-t border-beige p-4 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setLocale("en");
                    closeMobileMenu();
                  }}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-xl transition-colors",
                    locale === "en" ? "bg-cream text-golden" : "text-foreground hover:bg-cream/50"
                  )}
                  aria-label="Switch to English"
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLocale("ar");
                    closeMobileMenu();
                  }}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-xl transition-colors",
                    locale === "ar" ? "bg-cream text-golden" : "text-foreground hover:bg-cream/50"
                  )}
                  aria-label="التبديل إلى العربية"
                >
                  العربية
                </button>
              </div>

              {/* زر الدعوة للتسوق */}
              <div className="mt-auto border-t border-beige p-6">
                <Button className="w-full" asChild>
                  <Link href="/shop">{t("actions.shopNow")}</Link>
                </Button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
