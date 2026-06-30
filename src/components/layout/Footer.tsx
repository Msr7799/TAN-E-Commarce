"use client";
// ============================================================
// Footer — professional, with links and floating WhatsApp button
// ============================================================
import Image from "next/image";
import Link from "next/link";
import { FOOTER_LINKS, WHATSAPP_URL } from "@/constants";
import { useTranslation } from "@/utils/i18n";

const CURRENT_YEAR = new Date().getFullYear();

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/marbellacosmetics1/",
  tiktok: "https://www.tiktok.com/@marbellacosmetics1",
  x: "https://x.com/marbellacosmetics1",
};

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
                    src="/logo-orange.png"
                    alt={t("siteName")}
                    width={300}
                    height={300}
                    className="h-30 w-35 object-contain"
                  />
                </div>
                <span className="bg-gradient-to-r from-golden to-[#ff7119] bg-clip-text text-transparent">
                  {t("siteName")}
                </span>
              </Link>
              <p className="mb-4 text-sm leading-relaxed text-white/60">
                {t("footer.description")}
              </p>

              {/* Social media icons */}
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-transparent hover:bg-gradient-to-tr hover:from-[#feda75] hover:via-[#d62976] hover:to-[#4f5bd5] hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-transparent hover:bg-black hover:text-[#25F4EE]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16.6 5.82c-.93-.82-1.49-2.01-1.49-3.32h-3.06v13.36c0 1.5-1.22 2.72-2.72 2.72a2.72 2.72 0 0 1-2.72-2.72 2.72 2.72 0 0 1 2.72-2.72c.27 0 .53.04.78.11V9.97a5.78 5.78 0 0 0-.78-.05A5.78 5.78 0 0 0 3.55 15.7a5.78 5.78 0 0 0 5.78 5.78 5.78 5.78 0 0 0 5.78-5.78V9.07a8.18 8.18 0 0 0 4.77 1.52V7.53a4.94 4.94 0 0 1-3.28-1.71z" />
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href={SOCIAL_LINKS.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-transparent hover:bg-white hover:text-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar (simplified to avoid duplicate links) */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6 text-center sm:px-6 lg:px-8">
            <p className="flex flex-wrap items-center justify-center gap-1 text-sm text-white/40">
              <span>
                © {CURRENT_YEAR} {t("siteName")}. {t("footer.rights")} {t("builtBy")}
              </span>
              <a
                href="https://github.com/Msr7799/TAN-E-Commarce"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-golden transition-colors hover:text-white"
                aria-label="MSR GitHub repository"
              >
                MSR
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
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
