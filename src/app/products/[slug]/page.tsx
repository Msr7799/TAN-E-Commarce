import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { getProductBySlug, getRelatedProducts } from "@/services/products";
import ProductDetailClient from "./ProductDetailClient";
import { defaultMetadata } from "@/config/metadata";

// ============================================================
// Product Detail Page — SSR / ISR entry point
// ============================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Cache product data for 1 hour
const getCachedProduct = unstable_cache(
  async (slug: string) => getProductBySlug(slug),
  ["product"],
  { revalidate: 3600, tags: ["product"] }
);

const getCachedRelatedProducts = unstable_cache(
  async (productId: string, category: string) => getRelatedProducts(productId, category, 4),
  ["related-products"],
  { revalidate: 3600, tags: ["related-products"] }
);

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);
  if (!product) return defaultMetadata;

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL || "https://marbellatan.com"}${product.images[0]?.url ?? "/logo.avif"}`,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getCachedProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getCachedRelatedProducts(product.id, product.category);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
