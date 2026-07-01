"use client";

// ============================================================
// FAQ Section — Interactive Accordion with beautiful animations
// ============================================================
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/mockData";
import { cn } from "@/utils";
import { useTranslation } from "@/utils/i18n";

export function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { t } = useTranslation();

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-black/10 py-20 sm:py-28" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block text-lg font-semibold tracking-widest text-golden uppercase">
            {t("faqSection.tag")}
          </span>
          <h2 id="faq-heading" className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            {t("faqSection.title")}
          </h2>
          <p className="mt-4 text-black/70">{t("faqSection.description")}</p>
        </motion.div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === item.id;
            const itemQuestion = t(`faq.items.${item.id}.question`);
            const itemAnswer = t(`faq.items.${item.id}.answer`);
            const questionText =
              itemQuestion !== `faq.items.${item.id}.question` ? itemQuestion : item.question;
            const answerText =
              itemAnswer !== `faq.items.${item.id}.answer` ? itemAnswer : item.answer;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={cn(
                  "overflow-hidden rounded-3xl border transition-all duration-300",
                  isOpen
                    ? "border-golden/30 bg-white shadow-lg shadow-golden/5"
                    : "border-beige bg-white/60 hover:border-golden/20 hover:bg-white"
                )}
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="text-foreground flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold sm:px-8"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isOpen ? "text-golden" : "text-muted-foreground"
                      )}
                      aria-hidden="true"
                    />
                    <span>{questionText}</span>
                  </span>
                  <ChevronDown
                    className={cn(
                      "text-muted-foreground h-5 w-5 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180 text-golden"
                    )}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="text-muted-foreground border-t border-beige px-6 pt-4 pb-6 text-sm leading-relaxed whitespace-pre-line sm:px-8">
                        {answerText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
