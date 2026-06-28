"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Star, Shield, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/utils/i18n";

/**
 * مكون قسم الواجهة الرئيسي (HeroSection)
 * يتميز بتصميم متجاوب بالكامل وتأثيرات حركة المنظر (Parallax) وعناصر عائمة تفاعلية.
 */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  
  // تتبع حركة التمرير لتطبيق تأثير البارالاكس
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // تأثيرات الإزاحة والشفافية والحجم بناءً على التمرير
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  // قائمة شارات الثقة المعروضة أسفل أزرار اتخاذ القرار (CTAs)
  const TRUST_BADGES = [
    { icon: Star, label: t("hero.badges.customers") },
    { icon: Leaf, label: t("hero.badges.vegan") },
    { icon: Shield, label: t("hero.badges.moneyback") },
  ];

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-cream via-white to-beige"
      aria-labelledby="hero-heading"
    >
      {/* بقع الألوان المتحركة في الخلفية — تتقلص تلقائياً على الشاشات الصغيرة */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-1/3 top-1/4 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] lg:h-[600px] lg:w-[600px] rounded-full bg-golden/10 blur-[60px] sm:blur-[80px]"
        />
        <motion.div
          animate={{ scale: [1, 0.9, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -left-1/3 bottom-1/4 h-[250px] w-[250px] sm:h-[400px] sm:w-[400px] rounded-full bg-amber-200/20 blur-[60px]"
        />
      </div>

      {/* الدوائر التزيينية — تظهر على الشاشات الكبيرة فقط */}
      <motion.div
        style={{ y, opacity }}
        className="pointer-events-none absolute inset-0 hidden sm:flex items-center justify-center"
        aria-hidden="true"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute h-[600px] w-[600px] lg:h-[700px] lg:w-[700px] rounded-full border border-golden/10"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute h-[400px] w-[400px] lg:h-[500px] lg:w-[500px] rounded-full border border-golden/15"
        />
      </motion.div>

      {/* شبكة المحتوى الرئيسية */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-28 min-h-[100svh] lg:min-h-screen">

          {/* ── القسم الأيمن/الأيسر: نصوص التعريف والـ CTA ── */}
          <div className="flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1">

            {/* شارة التعريف الصغيرة (Tag) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-golden/30 bg-golden/10 px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-golden">
                <span className="h-1.5 w-1.5 rounded-full bg-golden" aria-hidden="true" />
                {t("hero.tag")}
              </span>
            </motion.div>

            {/* العنوان الرئيسي للموقع — متجاوب في أحجام الخطوط */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {t("hero.title").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-golden via-amber-500 to-golden bg-clip-text text-transparent">
                  {t("hero.title").split(" ").pop()}
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                  className="absolute -bottom-1 left-0 right-0 h-0.5 sm:h-1 origin-left rounded-full bg-gradient-to-r from-golden to-amber-400"
                  aria-hidden="true"
                />
              </span>{" "}
              <br className="hidden sm:block" />
              {t("hero.subtitle")}
            </motion.h1>

            {/* وصف الفكرة العامة للموقع */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground max-w-lg mx-auto lg:mx-0"
            >
              {t("hero.description")}
            </motion.p>

            {/* أزرار الانتقال المباشر (CTAs) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button size="lg" className="group w-full sm:w-auto" asChild>
                <Link href="/shop">
                  {t("hero.cta.shop")}
                  <ArrowRight
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/about">{t("hero.cta.learnMore")}</Link>
              </Button>
            </motion.div>

            {/* شارات الثقة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start"
            >
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5 text-golden shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── القسم الأيسر/الأيمن: صورة المنتج الترويجية وشارات التقييم العائمة ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ scale }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative mx-auto max-w-[320px] sm:max-w-sm md:max-w-md lg:max-w-none">
              {/* بطاقة الصورة الرئيسية */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-golden/20 via-amber-100 to-beige shadow-2xl shadow-golden/20">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="flex h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32 items-center justify-center rounded-full bg-gradient-to-br from-golden/30 to-amber-200/50 shadow-lg"
                  >
                    <span className="text-4xl sm:text-5xl lg:text-6xl">☀️</span>
                  </motion.div>
                  <div className="text-center px-8">
                    <p className="text-sm sm:text-base font-semibold text-golden/70">Hero Image Placeholder</p>
                    <p className="mt-1 text-xs text-golden/50">Replace with your product photo</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" aria-hidden="true" />
              </div>

              {/* بطاقة الإحصائيات العائمة (عدد العملاء) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-3 left-3 sm:-bottom-4 sm:-left-4 rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-xl ring-1 ring-black/5"
              >
                <p className="text-lg sm:text-2xl font-bold text-golden">
                  {t("hero.stats.number") !== "hero.stats.number" ? t("hero.stats.number") : "50K+"}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {t("hero.stats.label") !== "hero.stats.label" ? t("hero.stats.label") : "Happy customers"}
                </p>
              </motion.div>

              {/* بطاقة التقييم بالنجوم العائمة */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute right-3 top-4 sm:-right-4 sm:top-8 rounded-xl sm:rounded-2xl bg-black p-3 sm:p-4 shadow-xl"
              >
                <div className="flex items-center gap-0.5 sm:gap-1 text-golden">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-1 text-[10px] sm:text-xs text-white/70">
                  {t("hero.badges.rated")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* مؤشر التمرير للأسفل (مخفي على الشاشات الصغيرة جداً) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-xs text-muted-foreground">{t("hero.scroll")}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-8 w-5 rounded-full border-2 border-golden/30 flex items-start justify-center pt-1"
        >
          <div className="h-2 w-0.5 rounded-full bg-golden" />
        </motion.div>
      </motion.div>
    </section>
  );
}
