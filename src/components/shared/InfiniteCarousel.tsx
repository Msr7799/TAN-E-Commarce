"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/utils/i18n";

export function InfiniteCarousel() {
  const { t } = useTranslation();
  const carouselItems = [
    {
      image: "/brown-removebg.png",
      alt: t("carousel.altCoco"),
      text: t("carousel.paragraph1"),
    },
    {
      image: "/red-front-removebg.png",
      alt: t("carousel.altDeerBlood"),
      text: t("carousel.paragraph2"),
    },
    {
      image: "/orange-removebg.png",
      alt: t("carousel.altBronze"),
      text: t("carousel.paragraph3"),
    },
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % carouselItems.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [carouselItems.length]);

  return (
    <section className="bg-black py-12">
      {/* Headline */}
      <div className="mb-10 flex items-center justify-center gap-4 px-4">
        <span className="h-px max-w-xs flex-1 bg-white/10" aria-hidden="true" />
        <span className="text-center text-sm tracking-[0.35em] text-white/70 uppercase sm:text-base">
          {t("carousel.headline")}
        </span>
        <span className="h-px max-w-xs flex-1 bg-white/10" aria-hidden="true" />
      </div>

      <div className="relative mx-auto max-h-[640px] overflow-hidden border border-white/10 shadow-xl sm:max-h-[560px]">
        <video
          src="/beach-pannel.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          style={{ minHeight: "320px" }}
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 top-4 z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-6 px-4 pb-6 sm:top-8 sm:px-6 lg:flex-row lg:items-center lg:justify-center lg:gap-8">
          <div className="hidden w-full max-w-full flex-col items-center justify-center rounded-[1.75rem] border border-white/20 bg-black/60 p-5 shadow-2xl backdrop-blur-2xl sm:p-6 lg:flex lg:w-[44%]">
            <img
              src={carouselItems[activeIndex].image}
              alt={carouselItems[activeIndex].alt}
              className="mt-30 h-97 w-auto object-cover sm:h-64 lg:h-82"
            />
          </div>

          <div className="mt-10 flex w-full max-w-full flex-col justify-center rounded-[1.75rem] border border-white/15 bg-black/55 p-15 text-center text-white shadow-2xl backdrop-blur-2xl sm:p-6 lg:w-[52%] lg:text-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeIndex}
                initial={{ opacity: 0, filter: "blur(12px)", y: 16 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={{ opacity: 0, filter: "blur(12px)", y: -16 }}
                transition={{ duration: 0.8 }}
                className="text-sm leading-7 whitespace-pre-line text-white/90 sm:text-base lg:text-xl"
              >
                {carouselItems[activeIndex].text}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
