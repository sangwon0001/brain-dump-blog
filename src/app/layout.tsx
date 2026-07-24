import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics, Hotjar } from "@/components/Analytics";
import "./globals.css";
import BackToTop from "@/components/BackToTop";
import { Mascot } from "@/components/mascot";
import { getDictionary } from "@/i18n";
import { DEFAULT_LOCALE, LOCALE_TAGS, OG_LOCALES } from "@/i18n/config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.sangwon0001.xyz";

// 루트 레이아웃은 기본 로케일(ko) 기준. `/en` 하위는 en 레이아웃이 덮어쓴다.
const t = getDictionary(DEFAULT_LOCALE);
const SITE_NAME = t.site.name;
const SITE_DESCRIPTION = t.site.description;

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: OG_LOCALES[DEFAULT_LOCALE],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/api/og?title=${encodeURIComponent(SITE_NAME)}`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/api/og?title=${encodeURIComponent(SITE_NAME)}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Script to prevent flash of wrong theme
const themeScript = `
  (function() {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={LOCALE_TAGS[DEFAULT_LOCALE]} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <BackToTop />
        <Mascot />
        <Analytics />
        <GoogleAnalytics />
        <Hotjar />
      </body>
    </html>
  );
}
