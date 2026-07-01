"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PerformanceChart } from "@/components/admin/PerformanceChart";
import {
  AdminAnalyticsSnapshot,
  EMPTY_ADMIN_ANALYTICS_SNAPSHOT,
  fetchAdminAnalyticsSnapshot,
  getAdminChannelBreakdown,
  getAdminRevenueSeriesFromSnapshot,
} from "@/lib/analytics";
import { useTranslation } from "@/utils/i18n";

type AIAssistantMessage = {
  role: "user" | "assistant";
  text: string;
};

const SAMPLE_QUERIES = [
  "كيف كان أداء المبيعات خلال الأسبوع الماضي؟",
  "ما هي المنتجات الأكثر طلباً الآن؟",
  "هل هناك ارتفاع في زيارات البحث العضوي؟",
  "هل يجب أن نزود عرضاً خاصاً على منتجات البرونز؟",
];

export function AdminAIAssistant() {
  const { t } = useTranslation();
  const [snapshot, setSnapshot] = useState<AdminAnalyticsSnapshot>(EMPTY_ADMIN_ANALYTICS_SNAPSHOT);
  const [isLoading, setIsLoading] = useState(true);
  const revenueSeries = getAdminRevenueSeriesFromSnapshot(snapshot);
  const channelBreakdown = getAdminChannelBreakdown();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      role: "assistant",
      text:
        t("admin.ai.help") ||
        "Ask the assistant for a performance summary, product demand signals, or conversion suggestions.",
    },
  ]);

  useEffect(() => {
    let mounted = true;
    fetchAdminAnalyticsSnapshot()
      .then((data) => {
        if (mounted) setSnapshot(data);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const summaryText = useMemo(() => {
    return [
      `${t("admin.metrics.revenue")}: $${snapshot.revenue.toLocaleString()}`,
      `${t("admin.metrics.orders")}: ${snapshot.orders.toLocaleString()}`,
      `${t("admin.metrics.visitors")}: ${snapshot.visitors.toLocaleString()}`,
      `${t("admin.metrics.cartAdds")}: ${snapshot.cartAdds.toLocaleString()}`,
    ].join(" • ");
  }, [snapshot, t]);

  const handleAsk = async (prompt: string) => {
    if (!prompt.trim()) return;
    setErrorMessage(null);
    const userMessage: AIAssistantMessage = { role: "user", text: prompt.trim() };
    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);
    setQuestion("");

    try {
      const response = await fetch("/api/admin-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: prompt.trim(),
          context: {
            summary: summaryText,
            revenueSeries,
            channelBreakdown,
          },
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "AI assistant failed");
      }

      const assistantMessage: AIAssistantMessage = {
        role: "assistant",
        text:
          payload.answer ||
          "The AI assistant could not generate a response right now. Please try again later.",
      };
      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      setErrorMessage(String(error));
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "The AI assistant is currently unavailable. Review your Gemini API configuration and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-golden uppercase">
              {t("admin.badge")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-black-rich">{t("admin.ai.title")}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
              {t("admin.ai.description")}
            </p>
          </div>
          <div className="rounded-3xl border border-cream bg-cream/70 px-4 py-3 text-sm font-medium text-black/70">
            <Sparkles className="mb-1 inline h-4 w-4 text-golden" /> {t("admin.ai.historyTitle")}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-6">
          <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-black-rich">{t("admin.ai.title")}</h2>
                <p className="mt-2 text-sm text-black/60">{summaryText}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => handleAsk(SAMPLE_QUERIES[0])}>
                {t("admin.actions.refresh")}
              </Button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: t("admin.metrics.revenue"),
                  value: `$${snapshot.revenue.toLocaleString()}`,
                },
                { label: t("admin.metrics.orders"), value: snapshot.orders.toString() },
                { label: t("admin.metrics.visitors"), value: snapshot.visitors.toLocaleString() },
                { label: t("admin.metrics.cartAdds"), value: snapshot.cartAdds.toString() },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-cream bg-[#fbfdff] p-4">
                  <p className="text-xs tracking-[0.32em] text-black/50 uppercase">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-black-rich">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
            <PerformanceChart
              data={revenueSeries}
              title={t("admin.analytics.chartTitle")}
              subtitle={t("admin.analytics.chartSubtitle")}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-cream bg-gradient-to-b from-[#fff7e8] to-white p-6 shadow-sm shadow-black/5">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-golden" />
              <h3 className="text-lg font-semibold text-black-rich">
                {t("admin.analytics.channels")}
              </h3>
            </div>
            <div className="mt-5 space-y-4">
              {channelBreakdown.map((channel) => (
                <div key={channel.name}>
                  <div className="mb-2 flex items-center justify-between text-sm text-black/70">
                    <span>{channel.name}</span>
                    <span className="font-semibold text-golden">{channel.share}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-cream">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${channel.share}%`, backgroundColor: channel.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
            <h3 className="text-lg font-semibold text-black-rich">{t("admin.ai.title")}</h3>
            <p className="mt-2 text-sm text-black/60">{t("admin.ai.help")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SAMPLE_QUERIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAsk(item)}
                  className="rounded-full border border-cream bg-cream px-4 py-2 text-sm text-black-rich transition hover:border-golden hover:text-golden"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-black-rich">{t("admin.ai.title")}</h2>
              <p className="mt-1 text-sm text-black/60">{t("admin.ai.promptPlaceholder")}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-golden/20 bg-golden/5 px-3 py-2 text-sm text-black/75">
              <Zap className="h-4 w-4 text-golden" />
              {t("admin.ai.help")}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`rounded-3xl border p-4 ${
                    message.role === "user"
                      ? "border-golden/20 bg-golden/10 text-black-rich"
                      : "border-cream bg-[#fbfdff] text-black/80"
                  }`}
                >
                  <p className="text-xs tracking-[0.28em] text-black/45 uppercase">
                    {message.role === "user" ? t("profile.tab") : t("admin.ai.title")}
                  </p>
                  <p className="mt-2 text-sm leading-6 whitespace-pre-line">{message.text}</p>
                </div>
              ))}
            </div>

            {errorMessage && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleAsk(question);
              }}
              className="grid gap-3"
            >
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={4}
                placeholder={t("admin.ai.promptPlaceholder") || "Ask a question..."}
                className="w-full rounded-3xl border border-cream bg-white px-4 py-3 text-sm text-black-rich transition outline-none focus:border-golden focus:ring-2 focus:ring-golden/20"
              />
              <Button type="submit" isLoading={isLoading} className="w-full">
                {t("admin.actions.export")}
              </Button>
            </form>
          </div>
        </div>

        <div className="rounded-3xl border border-cream bg-gradient-to-br from-[#fff7e8] to-white p-6 shadow-sm shadow-black/5">
          <h3 className="text-lg font-semibold text-black-rich">{t("admin.ai.historyTitle")}</h3>
          <p className="mt-3 text-sm text-black/60">{t("admin.ai.description")}</p>
          <div className="mt-6 space-y-3">
            {messages.slice(-3).map((message, index) => (
              <div
                key={`summary-${index}`}
                className="rounded-3xl bg-cream p-4 text-sm text-black/75"
              >
                <p className="font-medium text-black-rich">
                  {message.role === "user" ? t("profile.tab") : t("admin.ai.title")}
                </p>
                <p className="mt-2 leading-6">{message.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
