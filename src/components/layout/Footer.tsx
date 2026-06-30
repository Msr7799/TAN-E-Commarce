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
            {/* Policies / Company links (first column) */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-widest text-golden uppercase">
                {t("footer.headers.policies")}
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

            {/* Support links (second) */}
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

            {/* Shop links (third) */}
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

            {/* Brand (last column) */}
            <div className="lg:col-span-1">
              <Link
                href="/"
                className="mb-4 flex items-center gap-2 text-xl font-bold"
                aria-label={`homepage`}
              >
                <div className="flex items-center justify-center">
                  <Image
                    src="/logo-green.png"
                    alt={t("siteName")}
                    width={300}
                    height={300}
                    className="h-30 w-35 object-contain"
                  />
                </div>
                <span className="bg-gradient-to-r from-golden to-[#4ebf11] bg-clip-text text-transparent">
                  {t("siteName")}
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-white/60">{t("footer.description")}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar (simplified to avoid duplicate links) */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-white/40">
              © {CURRENT_YEAR} {t("siteName")}. {t("footer.rights")}
            </p>
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
          alt="WhatsApp"
          width={28}
          height={28}
          className="object-contain"
        />
      </a>
    </>
  );
}
