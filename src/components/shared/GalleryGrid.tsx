"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { loadGalleryImages } from "@/lib/galleryStorage";

/**
 * ------------------------------------------------------------------
 * بيانات المعرض
 * ------------------------------------------------------------------
 * يتم تحديد النوع (صورة / فيديو) تلقائياً من امتداد الملف.
 * لو تبي تتحكم بنسبة الطول للعرض لكل عنصر (لتأثير الـ masonry الطبيعي)
 * أضف خاصية span اختيارية (1 = عادي، 2 = طويل).
 */
type MediaType = "image" | "video";

interface GalleryItem {
  id: number;
  src: string;
  type: MediaType;
  span?: 1 | 2; // يتحكم بارتفاع البلاطة داخل الـ masonry
}

const RAW_FILES = [
  "1.jpg",
  "2.mp4",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.jpg",
  "8.jpg",
  "9.jpg",
  "10.jpg",
  "11.jpg",
  "12.mp4",
  "13.jpg",
  "14.mp4",
  "15.jpg",
  "16.jpg",
  "17.jpg",
  "18.jpg",
  "19.png",
  "20.mp4",
];

function isVideoSource(src: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src) || src.startsWith("data:video");
}

const DEFAULT_GALLERY_ITEMS: GalleryItem[] = RAW_FILES.map((file, index) => {
  const id = index + 1;
  const type: MediaType = isVideoSource(file) ? "video" : "image";
  // نمط بسيط لتنويع الارتفاعات بشكل جمالي داخل الـ masonry
  const span: 1 | 2 = [0, 3, 7, 10].includes(index) ? 2 : 1;
  return { id, src: `/gallery/${file}`, type, span };
});

function convertStoredGalleryItems(stored: Array<{ id: number; src: string; alt: string }>) {
  return stored.map(
    (item, index) =>
      ({
        id: item.id,
        src: item.src,
        type: isVideoSource(item.src) ? "video" : "image",
        span: [0, 3, 7, 10].includes(index) ? 2 : 1,
      }) as GalleryItem
  );
}

/* ------------------------------------------------------------------ */
/* أنيميشنز */
/* ------------------------------------------------------------------ */

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const tileVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const lightboxVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 12,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

/* ------------------------------------------------------------------ */
/* بلاطة واحدة داخل المعرض */
/* ------------------------------------------------------------------ */

function GalleryTile({ item, onOpen }: { item: GalleryItem; onOpen: (item: GalleryItem) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  const handleEnter = useCallback(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const handleLeave = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <motion.button
      type="button"
      variants={tileVariants}
      onClick={() => onOpen(item)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group relative mb-4 block w-full overflow-hidden rounded-2xl border border-black/10 bg-neutral-100 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black/70"
      style={{
        breakInside: "avoid",
        aspectRatio: item.span === 2 ? "3 / 4" : "1 / 1",
      }}
    >
      {/* skeleton loader */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200" />
      )}

      {item.type === "image" ? (
        <img
          src={item.src}
          alt={`صورة المعرض ${item.id}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <video
          ref={videoRef}
          src={item.src}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      )}

      {item.type === "video" && (
        <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur">
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-3.5 w-3.5">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}

      <span className="pointer-events-none absolute bottom-3 left-3 translate-y-2 text-xs font-medium tracking-wide text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {String(item.id).padStart(2, "0")}
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* المعرض الرئيسي */
/* ------------------------------------------------------------------ */

export default function GalleryGrid() {
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedImages = loadGalleryImages();
    if (storedImages.length > 0) {
      setGalleryItems(convertStoredGalleryItems(storedImages));
    }
  }, []);

  // إغلاق بزر Escape + منع تمرير الصفحة أثناء فتح اللايت بوكس
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="columns-2 gap-4 sm:columns-3 lg:columns-4"
      >
        {galleryItems.map((item) => (
          <GalleryTile key={item.id} item={item} onOpen={setActive} />
        ))}
      </motion.div>

      {/* -------------------------------------------------------------- */}
      {/* Lightbox */}
      {/* -------------------------------------------------------------- */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={close}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            <motion.div
              key="content"
              variants={lightboxVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-2xl bg-neutral-950 shadow-2xl"
            >
              {active.type === "image" ? (
                <img
                  src={active.src}
                  alt={`صورة المعرض ${active.id}`}
                  className="max-h-[85vh] w-auto object-contain"
                />
              ) : (
                <video
                  src={active.src}
                  autoPlay
                  loop
                  controls
                  playsInline
                  className="max-h-[85vh] w-auto object-contain"
                />
              )}

              <button
                type="button"
                onClick={close}
                aria-label="إغلاق"
                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black transition hover:bg-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-4 w-4"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
