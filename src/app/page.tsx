// ============================================================
// Home Page —merbE-Commerce Landing Page
// ============================================================
import { HeroSection } from "@/components/shared/HeroSection";
import { InfiniteCarousel } from "@/components/shared/InfiniteCarousel";
import { ProductsGrid } from "@/components/shared/ProductsGrid";
import { FAQSection } from "@/components/shared/FAQSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Header Area */}
      <HeroSection />

      {/* Infinite Product Carousel */}
      <InfiniteCarousel />

      {/* Featured Products Grid */}
      <ProductsGrid />

      {/* FAQ Accordion Section */}
      <FAQSection />
    </div>
  );
}
