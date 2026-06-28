"use client";

import { motion } from "motion/react";
import { Sparkles, Shield, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/utils/i18n";

const VALUES = [
  { icon: Sparkles, key: "quality" },
  { icon: Shield, key: "skin" },
  { icon: Heart, key: "vegan" },
  { icon: Award, key: "award" },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-cream/20 min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-widest text-golden"
          >
            {t("about.tag")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-black sm:text-5xl mt-3"
          >
            {t("about.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base text-muted-foreground leading-relaxed"
          >
            {t("about.description")}
          </motion.p>
        </div>

        {/* Brand visual placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-golden/20 via-amber-100 to-beige mb-20 shadow-md"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <span className="text-5xl mb-2">✨ ☀️ ✨</span>
            <p className="text-lg font-bold text-golden-dark">{t("about.heroSubtitle")}</p>
            <p className="text-xs text-muted-foreground">{t("about.heroDesc")}</p>
          </div>
        </motion.div>

        {/* Values section */}
        <section className="space-y-12">
          <h2 className="text-2xl font-bold text-black text-center">{t("about.valuesTitle")}</h2>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-3xl border border-beige bg-white p-6 shadow-sm flex items-start gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream text-golden">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">{t(`about.values.${val.key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`about.values.${val.key}.description`)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-20 text-center rounded-[2.5rem] bg-black text-white p-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">{t("about.cta.title")}</h2>
          <p className="text-white/60 text-sm max-w-md mx-auto mb-6">
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
