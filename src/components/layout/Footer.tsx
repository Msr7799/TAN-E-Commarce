"use client";
// ============================================================
// Footer — professional, with links and floating WhatsApp button
// ============================================================
import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS, WHATSAPP_URL } from "@/constants";
import { useTranslation } from "@/utils/i18n";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  const { t } = useTranslation();
  return (
    <>
      <footer className="bg-black text-white">
        {/* Main footer content */}
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link
                href="/"
                className="mb-4 flex items-center gap-2 text-xl font-bold"
                aria-label={`homepage`}
              >
                <div className="flex h-10 w-10 items-center justify-center">
                  <Image
                    src="/logo.avif"
                    alt={t("siteName")}
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <span className="bg-gradient-to-r from-golden to-amber-400 bg-clip-text text-transparent">
                  {t("siteName")}
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-white/60">{t("footer.description")}</p>
            </div>

            {/* Shop links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-widest text-golden uppercase">
                {t("footer.headers.shop")}
              </h3>
              <ul className="flex flex-col gap-2" role="list">
                {FOOTER_LINKS.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-golden"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-widest text-golden uppercase">
                {t("footer.headers.support")}
              </h3>
              <ul className="flex flex-col gap-2" role="list">
                {FOOTER_LINKS.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-golden"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-widest text-golden uppercase">
                {t("footer.headers.company")}
              </h3>
              <ul className="flex flex-col gap-2" role="list">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-golden"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-center sm:flex-row sm:px-6 lg:px-8">
            <p className="text-sm text-white/40">
              © {CURRENT_YEAR} {t("siteName")}. {t("footer.rights")}
            </p>
            <div className="flex items-center gap-4 text-sm text-white/40">
              <Link href="/privacy" className="transition-colors hover:text-golden">
                {t("footer.company.privacyPolicy")}
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/terms" className="transition-colors hover:text-golden">
                {t("footer.company.termsOfService")}
              </Link>
              <span aria-hidden="true">·</span>
              <Link href="/shipping" className="transition-colors hover:text-golden">
                {t("footer.support.shippingPolicy")}
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:outline-none"
        aria-label="Chat with us on WhatsApp"
      >
        <Image
          src="/whatsapp-logo.svg"
          alt="WhatsApp logo"
          width={28}
          height={28}
          className="h-7 w-7"
        />
      </a>
    </>
  );
}
