"use client";

import GalleryGrid from "@/components/shared/GalleryGrid";
import { InstagramPreviewCard } from "@/components/shared/InstagramPreviewCard";
import { useTranslation } from "@/utils/i18n";

export default function GalleryPageClient() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-cream/10 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center justify-center gap-4 text-center">
          <InstagramPreviewCard />
        </div>

        <section className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-[0.32em] text-golden uppercase">
            {t("gallery.title")}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-black sm:text-5xl">
            {t("gallery.heading")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-black/70">
            {t("gallery.subheading")}
          </p>
        </section>

        <GalleryGrid />
      </div>
    </main>
  );
}
