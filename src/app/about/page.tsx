"use client";

import { motion } from "motion/react";
import { Sparkles, Shield, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/utils/i18n";

// مصفوفة تعريف القيم الأساسية للعلامة التجارية وربطها بالأيقونات والمفاتيح المترجمة
const VALUES = [
  { icon: Sparkles, key: "quality" },
  { icon: Shield, key: "skin" },
  { icon: Heart, key: "vegan" },
  { icon: Award, key: "award" },
];

/**
 * صفحة من نحن (AboutPage)
 * تستعرض قصة العلامة التجارية ورؤيتها، بالإضافة إلى توضيح القيم الأساسية
 * باستخدام لوحة عرض تفاعلية وتأثيرات ظهور متحركة.
 */
export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-cream/20 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* مقدمة الصفحة */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold tracking-widest text-golden uppercase"
          >
            {t("about.tag")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl"
          >
            {t("about.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground mt-4 text-base leading-relaxed"
          >
            {t("about.description")}
          </motion.p>
        </div>

        {/* لوحة عرض فيديو متحرك لصفحة من نحن */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-20 aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] bg-black/10 shadow-md"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-lg font-bold text-white">{t("about.heroSubtitle")}</p>
            <p className="text-xs text-slate-100/80">{t("about.heroDesc")}</p>
          </div>
        </motion.div>

        {/* قسم القيم الأساسية للشركة */}
        <section className="space-y-12">
          <h2 className="text-center text-2xl font-bold text-black">{t("about.valuesTitle")}</h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 rounded-3xl border border-beige bg-white p-6 shadow-sm"
                >
                  {/* حاوية الأيقونة التزيينية */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream text-golden">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-semibold">
                      {t(`about.values.${val.key}.title`)}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t(`about.values.${val.key}.description`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* قسم الدعوة لاتخاذ قرار (CTA) */}
        <div className="mt-20 rounded-[2.5rem] bg-black p-12 text-center text-white shadow-xl">
          <h2 className="mb-4 text-2xl font-bold">{t("about.cta.title")}</h2>
          <p className="mx-auto mb-6 max-w-md text-sm text-white/60">
            {t("about.cta.description")}
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">{t("about.cta.button")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
