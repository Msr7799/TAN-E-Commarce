import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { defaultMetadata, organizationSchema } from "@/config/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/app/providers";
import "./globals.css";

const googleSans = localFont({
  src: [
    {
      path: "../../public/fonts/Google_Sans/static/GoogleSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Google_Sans/static/GoogleSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Google_Sans/static/GoogleSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Google_Sans/static/GoogleSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const notoNaskhArabic = localFont({
  src: [
    {
      path: "../../public/fonts/Noto_Naskh_Arabic/static/NotoNaskhArabic-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Noto_Naskh_Arabic/static/NotoNaskhArabic-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Noto_Naskh_Arabic/static/NotoNaskhArabic-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Noto_Naskh_Arabic/static/NotoNaskhArabic-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ar",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: "#5BB8F5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${googleSans.variable} ${notoNaskhArabic.variable} h-full scroll-smooth antialiased`}
    >
      <body className="text-foreground flex min-h-full flex-col bg-white">
        {/* Schema markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />

        <Providers>
          {/* Main header navbar */}
          <Navbar />

          {/* Main page content area */}
          <main className="flex-1 pt-16">{children}</main>

          {/* Sticky footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
