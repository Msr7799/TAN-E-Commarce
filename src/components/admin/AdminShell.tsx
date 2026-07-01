"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Cpu,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/utils/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

const adminNav = [
  { href: "/admin", labelKey: "admin.nav.dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", labelKey: "admin.nav.analytics", icon: BarChart3 },
  { href: "/admin/ai", labelKey: "admin.nav.ai", icon: Sparkles },
  { href: "/admin/orders", labelKey: "admin.nav.orders", icon: ShoppingBag },
  { href: "/admin/products", labelKey: "admin.nav.products", icon: Package },
  { href: "/admin/customers", labelKey: "admin.nav.customers", icon: Users },
  { href: "/admin/search", labelKey: "admin.nav.search", icon: Search },
  { href: "/admin/settings", labelKey: "admin.nav.settings", icon: Settings },
  { href: "/admin/system", labelKey: "admin.nav.system", icon: Cpu },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, userProfile, isLoading, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fbff] px-6">
        <div className="rounded-3xl border border-cream bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-golden border-t-transparent" />
          <p className="text-sm font-medium text-black/60">{t("admin.loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fbff] px-6">
        <div className="w-full max-w-md rounded-[2rem] border border-cream bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-golden">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-black-rich">{t("admin.access.title")}</h1>
          <p className="mt-3 text-sm leading-6 text-black/60">{t("admin.access.description")}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link href="/">{t("admin.access.backHome")}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile?.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fbff] px-6">
        <div className="w-full max-w-md rounded-[2rem] border border-cream bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-golden">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-black-rich">
            {t("admin.access.deniedTitle")}
          </h1>
          <p className="mt-3 text-sm leading-6 text-black/60">
            {t("admin.access.deniedDescription")}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link href="/">{t("admin.access.backHome")}</Link>
            </Button>
            <Button variant="outline" onClick={() => logout()}>
              {t("admin.access.signOut")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] text-black-rich">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
        <aside className="w-full shrink-0 rounded-[2rem] border border-cream bg-white/90 p-4 shadow-sm shadow-black/5 lg:sticky lg:top-6 lg:w-72 lg:self-start">
          <div className="flex items-center justify-between lg:block">
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-golden uppercase">
                {t("admin.badge")}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-black-rich">{t("admin.title")}</h2>
            </div>
            <button
              className="rounded-full border border-cream p-2 text-black/70 lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
              aria-label={t("admin.toggleNav")}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-cream bg-cream/70 p-4">
            <p className="text-sm font-semibold text-black-rich">{t("admin.welcome")}</p>
            <p className="mt-1 text-sm text-black/60">
              {user.displayName || user.email || t("admin.admin")}
            </p>
          </div>

          <nav className="mt-6 hidden space-y-2 lg:block">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-golden text-white shadow-sm"
                      : "text-black/70 hover:bg-cream hover:text-black-rich"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <AnimatePresence initial={false}>
            {mobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-2 overflow-hidden lg:hidden"
              >
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-golden text-white shadow-sm"
                          : "text-black/70 hover:bg-cream hover:text-black-rich"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {t(item.labelKey)}
                    </Link>
                  );
                })}
              </motion.nav>
            )}
          </AnimatePresence>

          <div className="mt-6 border-t border-cream pt-4">
            <Button variant="outline" className="w-full justify-start" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("admin.signOut")}
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="rounded-[2rem] border border-cream bg-white/80 p-4 shadow-sm shadow-black/5 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
