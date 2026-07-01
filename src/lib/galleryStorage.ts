export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const STORAGE_KEY = "marbella-tan-gallery";

const DEFAULT_GALLERY_ITEMS: GalleryImage[] = [
  { id: 1, src: "/gallery/1.jpg", alt: "Marbella gallery image 1" },
  { id: 2, src: "/gallery/2.mp4", alt: "Marbella gallery video 2" },
  { id: 3, src: "/gallery/3.jpg", alt: "Marbella gallery image 3" },
  { id: 4, src: "/gallery/4.jpg", alt: "Marbella gallery image 4" },
  { id: 5, src: "/gallery/5.jpg", alt: "Marbella gallery image 5" },
  { id: 6, src: "/gallery/6.jpg", alt: "Marbella gallery image 6" },
  { id: 7, src: "/gallery/7.jpg", alt: "Marbella gallery image 7" },
  { id: 8, src: "/gallery/8.jpg", alt: "Marbella gallery image 8" },
  { id: 9, src: "/gallery/9.jpg", alt: "Marbella gallery image 9" },
  { id: 10, src: "/gallery/10.jpg", alt: "Marbella gallery image 10" },
  { id: 11, src: "/gallery/11.jpg", alt: "Marbella gallery image 11" },
  { id: 12, src: "/gallery/12.mp4", alt: "Marbella gallery video 12" },
  { id: 13, src: "/gallery/13.jpg", alt: "Marbella gallery image 13" },
  { id: 14, src: "/gallery/14.mp4", alt: "Marbella gallery video 14" },
  { id: 15, src: "/gallery/15.jpg", alt: "Marbella gallery image 15" },
  { id: 16, src: "/gallery/16.jpg", alt: "Marbella gallery image 16" },
  { id: 17, src: "/gallery/17.jpg", alt: "Marbella gallery image 17" },
  { id: 18, src: "/gallery/18.jpg", alt: "Marbella gallery image 18" },
  { id: 19, src: "/gallery/19.png", alt: "Marbella gallery image 19" },
  { id: 20, src: "/gallery/20.mp4", alt: "Marbella gallery video 20" },
];

export function loadGalleryImages(): GalleryImage[] {
  if (typeof window === "undefined") {
    return DEFAULT_GALLERY_ITEMS;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_GALLERY_ITEMS;
    const parsed = JSON.parse(stored) as GalleryImage[];
    if (!Array.isArray(parsed)) return DEFAULT_GALLERY_ITEMS;
    return parsed;
  } catch {
    return DEFAULT_GALLERY_ITEMS;
  }
}

export function saveGalleryImages(images: GalleryImage[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
}

export function generateGalleryImageId(currentItems: GalleryImage[]) {
  return currentItems.length === 0 ? 1 : Math.max(...currentItems.map((item) => item.id)) + 1;
}
