import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/services/products";
import ProductDetailClient from "./ProductDetailClient";
import { defaultMetadata } from "@/config/metadata";

// ============================================================
// Product Detail Page — SSR / ISR entry point
// ============================================================

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return defaultMetadata;

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: `${process.env.NEXT_PUBLIC_APP_URL || "https://luxetan.com"}/placeholder/product.jpg` }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category, 4);

  return (
    <ProductDetailClient product={product} relatedProducts={relatedProducts} />
  );
}
