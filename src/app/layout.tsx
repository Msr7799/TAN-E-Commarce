import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { defaultMetadata, organizationSchema } from "@/config/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/app/providers";
import "./globals.css";

// Premium modern font for luxury brand feel
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
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
      className={`${outfit.variable} h-full scroll-smooth antialiased`}
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
