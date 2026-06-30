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
      className="relative overflow-hidden bg-[url('/hero-bg.webp')] bg-cover bg-center bg-no-repeat"
      aria-labelledby="hero-heading"
    >
      {/* 
        طبقة التدرج (Gradient Overlay) لتحسين القراءة:
        - على الجوال: خلفية بيضاء شبه شفافة بالكامل.
        - على الشاشات الكبيرة: تدرج لوني أبيض كثيف يساراً (خلف النص) ويتلاشى يميناً (خلف المنتج). 
      */}
      <div
        className="absolute inset-0 bg-white/40 backdrop-blur-[3px] lg:bg-gradient-to-r lg:from-white/45 lg:via-white/40 lg:to-transparent"
        aria-hidden="true"
      />

      {/* بقع الألوان المتحركة في الخلفية */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-1/3 h-[300px] w-[300px] rounded-full bg-sky-300/20 blur-[60px] sm:h-[500px] sm:w-[500px] sm:blur-[80px] lg:h-[600px] lg:w-[600px]"
        />
        <motion.div
          animate={{ scale: [1, 0.9, 1], x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 -left-1/3 h-[250px] w-[250px] rounded-full bg-indigo-200/20 blur-[60px] sm:h-[400px] sm:w-[400px]"
        />
      </div>

      {/* الدوائر التزيينية — تظهر على الشاشات الكبيرة فقط */}
      <motion.div
        style={{ y, opacity }}
        className="pointer-events-none absolute inset-0 hidden items-center justify-center sm:flex"
        aria-hidden="true"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute h-[600px] w-[600px] rounded-full border border-golden/20 lg:h-[700px] lg:w-[700px]"
        />
      </motion.div>

      {/* شبكة المحتوى الرئيسية */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[100svh] items-center gap-8 py-12 sm:py-16 lg:min-h-screen lg:grid-cols-2 lg:gap-16 lg:py-28">
          {/* ── القسم الأيمن/الأيسر: نصوص التعريف والـ CTA ── */}
          <div className="order-2 flex flex-col gap-6 text-center lg:order-1 lg:text-left">
            {/* شارة التعريف الصغيرة (Tag) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-golden/30 bg-white/90 px-4 py-1.5 text-[11px] font-bold tracking-widest text-golden uppercase shadow-sm sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-golden" aria-hidden="true" />
                {t("hero.tag")}
              </span>
            </motion.div>

            {/* العنوان الرئيسي للموقع */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl leading-tight font-extrabold tracking-tight text-gray-900 drop-shadow-sm sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {t("hero.title").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-golden via-[#4ebf11] to-golden bg-clip-text text-transparent drop-shadow-md">
                  {t("hero.title").split(" ").pop()}
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                  className="absolute right-0 -bottom-1 left-0 h-0.5 origin-left rounded-full bg-gradient-to-r from-golden to-golden-light sm:h-1"
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
              className="mx-auto max-w-lg text-sm leading-relaxed font-semibold text-gray-800 drop-shadow-sm sm:text-base lg:mx-0 lg:text-lg"
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
              <Button
                size="lg"
                className="group w-full shadow-lg transition-all hover:shadow-xl sm:w-auto"
                asChild
              >
                <Link href="/shop">
                  {t("hero.cta.shop")}
                  <ArrowRight
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-gray-300 bg-white/80 font-semibold text-gray-900 shadow-sm backdrop-blur-md hover:bg-white sm:w-auto"
                asChild
              >
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
                  className="flex items-center gap-1.5 rounded-md border border-white/50 bg-white/70 px-2.5 py-1.5 text-[11px] font-bold text-gray-800 shadow-sm backdrop-blur-md sm:text-xs"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-golden" aria-hidden="true" />
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
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-white/20 bg-[#f2f0ed] shadow-2xl shadow-black/20 sm:rounded-[2.5rem]">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: "url('/back3colors.webp')" }}
                  role="img"
                  aria-label="Marbella Tan tanning oil collection"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                  aria-hidden="true"
                />
              </div>

              {/* بطاقة الإحصائيات العائمة (عدد العملاء) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="absolute -bottom-3 left-3 rounded-xl bg-white p-3 shadow-xl ring-1 ring-black/5 sm:-bottom-4 sm:-left-4 sm:rounded-2xl sm:p-4"
              >
                <p className="text-lg font-bold text-golden sm:text-2xl">
                  {t("hero.stats.number") !== "hero.stats.number" ? t("hero.stats.number") : "50K+"}
                </p>
                <p className="text-[10px] font-semibold text-gray-600 sm:text-xs">
                  {t("hero.stats.label") !== "hero.stats.label"
                    ? t("hero.stats.label")
                    : "Happy customers"}
                </p>
              </motion.div>

              {/* بطاقة التقييم بالنجوم العائمة */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute top-4 right-3 rounded-xl border border-white/10 bg-black/90 p-3 shadow-xl backdrop-blur-md sm:top-8 sm:-right-4 sm:rounded-2xl sm:p-4"
              >
                <div className="flex items-center gap-0.5 text-golden sm:gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="h-2.5 w-2.5 fill-current sm:h-3 sm:w-3"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mt-1 text-[10px] font-medium text-white/90 sm:text-xs">
                  {t("hero.badges.rated")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* مؤشر التمرير للأسفل */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        aria-hidden="true"
      >
        <span className="rounded-md border border-white/50 bg-white/70 px-2.5 py-1 text-xs font-bold text-gray-800 shadow-sm backdrop-blur-md">
          {t("hero.scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-gray-800/50 bg-white/30 pt-1 backdrop-blur-sm"
        >
          <div className="h-2 w-0.5 rounded-full bg-gray-800" />
        </motion.div>
      </motion.div>
    </section>
  );
}
