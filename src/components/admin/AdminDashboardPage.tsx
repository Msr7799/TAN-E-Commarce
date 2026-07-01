"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Search,
  ShoppingBag,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/utils/i18n";
import { useCurrency } from "@/utils";
import { MetricCard } from "@/components/admin/MetricCard";
import { PerformanceChart } from "@/components/admin/PerformanceChart";
import {
  AdminAnalyticsSnapshot,
  EMPTY_ADMIN_ANALYTICS_SNAPSHOT,
  fetchAdminAnalyticsData,
  getAdminChannelBreakdown,
  getAdminRevenueSeriesFromSnapshot,
} from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { AdminGalleryManager } from "@/components/admin/AdminGalleryManager";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";

interface AdminDashboardPageProps {
  section:
    | "dashboard"
    | "analytics"
    | "orders"
    | "products"
    | "customers"
    | "search"
    | "settings"
    | "system";
}

export function AdminDashboardPage({ section }: AdminDashboardPageProps) {
  const { t } = useTranslation();
  const { currency, formatPrice, convertAmount } = useCurrency();
  const [analyticsSnapshot, setAnalyticsSnapshot] = useState<AdminAnalyticsSnapshot>(
    EMPTY_ADMIN_ANALYTICS_SNAPSHOT
  );
  const [purchaseOrders, setPurchaseOrders] = useState<
    Array<{ id: string; total: number; currency: string; status: string; timestamp: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchAdminAnalyticsData()
      .then((data) => {
        if (mounted) {
          setAnalyticsSnapshot(data.snapshot);
          setPurchaseOrders(data.purchaseOrders);
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const revenueSeries = getAdminRevenueSeriesFromSnapshot(analyticsSnapshot).map((item) => ({
    ...item,
    revenue: convertAmount(item.revenue, "BHD", currency.code),
  }));
  const channelBreakdown = getAdminChannelBreakdown();

  const metrics = [
    {
      title: t("admin.metrics.revenue"),
      value: formatPrice(
        convertAmount(analyticsSnapshot.revenue, "BHD", currency.code),
        currency.code
      ),
      delta: "+18.2%",
      detail: t("admin.metrics.weekly"),
      icon: CircleDollarSign,
    },
    {
      title: t("admin.metrics.orders"),
      value: analyticsSnapshot.orders.toString(),
      delta: "+7.4%",
      detail: t("admin.metrics.last7Days"),
      icon: ShoppingBag,
    },
    {
      title: t("admin.metrics.visitors"),
      value: analyticsSnapshot.visitors.toLocaleString(),
      delta: "+12.1%",
      detail: t("admin.metrics.returning"),
      icon: Users,
    },
    {
      title: t("admin.metrics.cartAdds"),
      value: analyticsSnapshot.cartAdds.toString(),
      delta: "+4.8%",
      detail: t("admin.metrics.productViews"),
      icon: Sparkles,
    },
  ];

  const renderContent = () => {
    switch (section) {
      case "analytics":
        return (
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <PerformanceChart
              data={revenueSeries}
              title={t("admin.analytics.chartTitle")}
              subtitle={t("admin.analytics.chartSubtitle")}
            />
            <div className="space-y-6">
              <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
                <h3 className="text-lg font-semibold text-black-rich">
                  {t("admin.analytics.channels")}
                </h3>
                <div className="mt-6 space-y-4">
                  {channelBreakdown.map((item) => (
                    <div key={item.name}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-black/75">{item.name}</span>
                        <span className="font-semibold text-golden">{item.share}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-cream">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${item.share}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-cream bg-gradient-to-br from-[#fff7e8] to-white p-6 shadow-sm shadow-black/5">
                <p className="text-sm font-semibold tracking-[0.3em] text-golden uppercase">
                  {t("admin.analytics.live")}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-black-rich">
                  {t("admin.analytics.insight")}
                </h3>
                <p className="mt-3 text-sm leading-6 text-black/60">
                  {t("admin.analytics.insightText")}
                </p>
              </div>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black-rich">{t("admin.orders.title")}</h3>
                <p className="text-sm text-black/55">{t("admin.orders.subtitle")}</p>
              </div>
              <Button variant="secondary" size="sm">
                {t("admin.actions.export")}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-cream text-left text-black/55">
                    <th className="pb-3">{t("admin.orders.table.order")}</th>
                    <th className="pb-3">{t("admin.orders.table.customer")}</th>
                    <th className="pb-3">{t("admin.orders.table.status")}</th>
                    <th className="pb-3">{t("admin.orders.table.total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "#1042",
                      customer: "Sara",
                      status: t("admin.orders.table.paid"),
                      total: "$248",
                    },
                    {
                      id: "#1041",
                      customer: "Mona",
                      status: t("admin.orders.table.processing"),
                      total: "$76",
                    },
                    {
                      id: "#1040",
                      customer: "Ali",
                      status: t("admin.orders.table.shipped"),
                      total: "$132",
                    },
                  ].map((order) => (
                    <tr key={order.id} className="border-b border-cream/70">
                      <td className="py-4 font-semibold text-black-rich">{order.id}</td>
                      <td className="py-4">{order.customer}</td>
                      <td className="py-4">
                        <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-golden">
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4">{order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case "products":
        return (
          <div className="space-y-6">
            <AdminProductsManager />
            <AdminGalleryManager />
          </div>
        );
      case "customers":
        return (
          <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black-rich">
                  {t("admin.customers.title")}
                </h3>
                <p className="text-sm text-black/55">{t("admin.customers.subtitle")}</p>
              </div>
              <Button variant="secondary" size="sm">
                {t("admin.actions.export")}
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { name: "Lina", segment: t("admin.customers.vip"), value: "12 orders" },
                { name: "Fatima", segment: t("admin.customers.repeater"), value: "7 orders" },
                { name: "Khalid", segment: t("admin.customers.new"), value: "1 order" },
              ].map((customer) => (
                <div
                  key={customer.name}
                  className="flex items-center justify-between rounded-2xl border border-cream bg-[#fbfdff] px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-black-rich">{customer.name}</p>
                    <p className="text-sm text-black/55">{customer.segment}</p>
                  </div>
                  <span className="text-sm font-medium text-golden">{customer.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "search":
        return (
          <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black-rich">{t("admin.search.title")}</h3>
                <p className="text-sm text-black/55">{t("admin.search.subtitle")}</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-cream bg-cream px-3 py-2 text-sm text-black/60">
                <Search className="h-4 w-4" />
                {t("admin.search.placeholder")}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                t("admin.search.result1"),
                t("admin.search.result2"),
                t("admin.search.result3"),
                t("admin.search.result4"),
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-cream bg-[#fbfdff] p-4 text-sm text-black/65"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
              <h3 className="text-lg font-semibold text-black-rich">{t("admin.settings.title")}</h3>
              <div className="mt-6 space-y-4">
                {[
                  { label: t("admin.settings.autoSync"), hint: t("admin.settings.autoSyncHint") },
                  { label: t("admin.settings.alerts"), hint: t("admin.settings.alertsHint") },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-cream bg-[#fbfdff] px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-black-rich">{item.label}</p>
                      <p className="text-sm text-black/55">{item.hint}</p>
                    </div>
                    <div className="h-6 w-11 rounded-full bg-golden/25" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-cream bg-gradient-to-br from-[#fff7e8] to-white p-6 shadow-sm shadow-black/5">
              <h3 className="text-lg font-semibold text-black-rich">{t("admin.settings.api")}</h3>
              <p className="mt-3 text-sm leading-6 text-black/60">{t("admin.settings.apiText")}</p>
              <Button className="mt-6" variant="secondary">
                {t("admin.actions.refresh")}
              </Button>
            </div>
          </div>
        );
      case "system":
        return (
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cream p-3 text-golden">
                  <Workflow className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black-rich">
                    {t("admin.system.operations")}
                  </h3>
                  <p className="text-sm text-black/55">{t("admin.system.operationsText")}</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { label: t("admin.system.database"), status: "Healthy" },
                  { label: t("admin.system.cache"), status: "Healthy" },
                  { label: t("admin.system.jobs"), status: "Queued" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-2xl border border-cream bg-[#fbfdff] px-4 py-3"
                  >
                    <span className="font-medium text-black-rich">{item.label}</span>
                    <span className="text-sm font-semibold text-golden">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cream p-3 text-golden">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black-rich">
                    {t("admin.system.health")}
                  </h3>
                  <p className="text-sm text-black/55">{t("admin.system.healthText")}</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-cream bg-[#fbfdff] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/60">{t("admin.system.uptime")}</span>
                  <span className="font-semibold text-golden">99.98%</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-black/60">{t("admin.system.response")}</span>
                  <span className="font-semibold text-golden">118ms</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            <PerformanceChart
              data={revenueSeries}
              title={t("admin.dashboard.chartTitle")}
              subtitle={t("admin.dashboard.chartSubtitle")}
            />
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-black-rich">
                      {t("admin.dashboard.recentOrders")}
                    </h3>
                    <p className="text-sm text-black/55">
                      {t("admin.dashboard.recentOrdersSubtitle")}
                    </p>
                  </div>
                  <Link href="/admin/orders" className="text-sm font-semibold text-golden">
                    {t("admin.actions.viewAll")}
                  </Link>
                </div>
                <div className="space-y-3">
                  {purchaseOrders.length > 0 ? (
                    purchaseOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-2xl border border-cream bg-[#fbfdff] px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-black-rich">{order.id}</p>
                          <p className="text-sm text-black/55">{order.status}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black-rich">
                            {formatPrice(
                              convertAmount(order.total, order.currency as "BHD", currency.code),
                              currency.code
                            )}
                          </p>
                          <p className="text-sm text-golden">{order.currency}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-cream bg-[#fbfdff] p-4 text-center text-sm text-black/55">
                      {t("admin.dashboard.noOrders") || "No orders available."}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-black-rich">
                        {t("admin.dashboard.quickActions")}
                      </h3>
                      <p className="text-sm text-black/55">
                        {t("admin.dashboard.quickActionsSubtitle")}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: t("admin.actions.addProduct"), href: "/admin/products" },
                      { label: t("admin.actions.reviewOrders"), href: "/admin/orders" },
                      { label: t("admin.actions.manageCustomers"), href: "/admin/customers" },
                    ].map((action) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center justify-between rounded-2xl border border-cream bg-[#fbfdff] px-4 py-3 text-sm font-semibold text-black-rich"
                      >
                        <span>{action.label}</span>
                        <ArrowUpRight className="h-4 w-4 text-golden" />
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-cream bg-gradient-to-br from-[#fff7e8] to-white p-6 shadow-sm shadow-black/5">
                  <p className="text-sm font-semibold tracking-[0.3em] text-golden uppercase">
                    {t("admin.dashboard.alert")}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-black-rich">
                    {t("admin.dashboard.alertTitle")}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-black/60">
                    {t("admin.dashboard.alertText")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="rounded-[2rem] border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
          <p className="text-sm text-black/60">Loading real analytics...</p>
        </div>
      )}
      <div className="rounded-[2rem] border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] text-golden uppercase">
              {t("admin.badge")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-black-rich">
              {t(`admin.${section}.title`)}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-black/60">
              {t(`admin.${section}.description`)}
            </p>
          </div>
          <div className="rounded-2xl border border-cream bg-cream/70 px-4 py-3 text-sm font-medium text-black/70">
            {t("admin.liveStatus")}:{" "}
            <span className="font-semibold text-golden">{t("admin.online")}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {renderContent()}
    </div>
  );
}
