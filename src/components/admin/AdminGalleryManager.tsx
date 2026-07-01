"use client";

import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/utils/i18n";
import { generateGalleryImageId, loadGalleryImages, saveGalleryImages } from "@/lib/galleryStorage";

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_STEP = 6;
const MAX_GALLERY_ITEMS = 100;

function isVideoSource(src: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(src) || src.startsWith("data:video");
}

function readFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function validateVideoDuration(src: string) {
  return new Promise<{ ok: boolean; duration?: number; errorKey?: string }>((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.onloadedmetadata = () => {
      const duration = Number(video.duration);
      if (!Number.isFinite(duration)) {
        resolve({ ok: false, errorKey: "admin.gallery.manager.error.videoMetadata" });
        return;
      }
      resolve({
        ok: duration <= 30,
        duration,
        errorKey: duration > 30 ? "admin.gallery.manager.error.videoDurationLimit" : undefined,
      });
    };
    video.onerror = () => {
      resolve({ ok: false, errorKey: "admin.gallery.manager.error.videoMetadata" });
    };
    if (src.startsWith("data:") || src.startsWith("blob:")) {
      video.src = src;
    } else {
      video.crossOrigin = "anonymous";
      video.src = src;
    }
  });
}

export function AdminGalleryManager() {
  const { t } = useTranslation();
  const [images, setImages] = useState<Array<{ id: number; src: string; alt: string }>>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setImages(loadGalleryImages().slice(0, MAX_GALLERY_ITEMS));
  }, []);

  useEffect(() => {
    setVisibleCount(Math.min(INITIAL_VISIBLE_COUNT, images.length));
  }, [images]);

  const handleAdd = async () => {
    setErrorMessage("");
    setIsAdding(true);

    let src = imageUrl.trim();
    let alt = imageAlt.trim();

    if (file) {
      try {
        src = await readFileToDataUrl(file);
        if (!alt) alt = file.name;
      } catch {
        setErrorMessage(t("admin.gallery.manager.error.readFile"));
        setIsAdding(false);
        return;
      }
    }

    if (!src) {
      setErrorMessage(t("admin.gallery.manager.error.enterMediaSource"));
      setIsAdding(false);
      return;
    }

    if (isVideoSource(src)) {
      const validation = await validateVideoDuration(src);
      if (!validation.ok) {
        setErrorMessage(t(validation.errorKey ?? "admin.gallery.manager.error.videoMetadata"));
        setIsAdding(false);
        return;
      }
    }

    const nextImages = [
      { id: generateGalleryImageId(images), src, alt: alt || "Gallery media" },
      ...images,
    ];
    const limitedImages = nextImages.slice(0, MAX_GALLERY_ITEMS);

    setImages(limitedImages);
    saveGalleryImages(limitedImages);
    setImageUrl("");
    setImageAlt("");
    setFile(null);
    setIsAdding(false);
  };

  const handleDelete = (id: number) => {
    const nextImages = images.filter((image) => image.id !== id);
    setImages(nextImages);
    saveGalleryImages(nextImages);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-cream bg-[#fbfdff] p-6 shadow-sm shadow-black/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-black-rich">
              {t("admin.gallery.manager.sectionTitle")}
            </h3>
            <p className="mt-1 text-sm text-black/60">
              {t("admin.gallery.manager.sectionDescription")}
            </p>
          </div>
          <div className="grid gap-2 sm:auto-cols-max sm:grid-flow-col sm:items-center">
            <div className="space-y-2 text-sm text-black/70">
              <p className="font-semibold text-black-rich">{t("admin.gallery.manager.newMedia")}</p>
              <p className="text-xs text-black/55">{t("admin.gallery.manager.newMediaHint")}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-black/70">
            <span>{t("admin.gallery.manager.urlOrPath")}</span>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={t("admin.gallery.manager.urlOrPathPlaceholder")}
              className="w-full rounded-2xl border border-beige bg-white px-4 py-3 text-sm outline-none focus:border-golden"
            />
          </label>
          <label className="space-y-2 text-sm text-black/70">
            <span>{t("admin.gallery.manager.uploadFile")}</span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full rounded-2xl border border-beige bg-white px-4 py-3 text-sm outline-none focus:border-golden"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder={t("admin.gallery.manager.altTextPlaceholder")}
            className="rounded-2xl border border-beige bg-white px-4 py-3 text-sm outline-none focus:border-golden"
          />
          <div className="flex items-end">
            <Button variant="secondary" onClick={handleAdd} disabled={isAdding}>
              <Upload className="mr-2 h-4 w-4" />
              {isAdding ? t("admin.gallery.manager.adding") : t("admin.gallery.manager.addMedia")}
            </Button>
          </div>
        </div>
        {errorMessage && (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {images.slice(0, visibleCount).map((image) => (
          <div
            key={image.id}
            className="rounded-3xl border border-beige bg-white p-4 shadow-sm shadow-black/5"
          >
            {isVideoSource(image.src) ? (
              <video src={image.src} controls className="h-48 w-full rounded-2xl object-cover" />
            ) : (
              <img
                src={image.src}
                alt={image.alt}
                className="h-48 w-full rounded-2xl object-cover"
              />
            )}
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-black-rich">
                  {t("admin.gallery.manager.mediaLabel", { id: image.id })}
                </p>
                <p className="text-sm text-black/60">{image.alt}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(image.id)}>
                {t("admin.gallery.manager.deleteMedia")}
              </Button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="rounded-3xl border border-beige bg-cream/70 p-6 text-center text-sm text-black/60">
            {t("admin.gallery.manager.emptyState")}
          </div>
        )}
      </div>

      {visibleCount < Math.min(images.length, MAX_GALLERY_ITEMS) && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="secondary"
            onClick={() =>
              setVisibleCount((current) =>
                Math.min(current + LOAD_MORE_STEP, images.length, MAX_GALLERY_ITEMS)
              )
            }
          >
            {t("admin.gallery.manager.loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}
