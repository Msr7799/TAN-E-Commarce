// ============================================================
// FAQ Page — Reuses the interactive FAQ component
// ============================================================
import { FAQSection } from "@/components/shared/FAQSection";

export const metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to all your tanning and shipping questions.",
};

export default function FAQPage() {
  return (
    <div className="pt-8">
      <FAQSection />
    </div>
  );
}
