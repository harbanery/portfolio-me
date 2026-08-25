import "@/assets/global/index.css";
import type { Metadata, Viewport } from "next";
import {
  BASE_URL,
  META_APP,
  META_DESCRIPTION,
  META_TITLE,
  NODE_ENV,
} from "@/config/variables";
import { VercelCompatibleComponents } from "@/components/vercel";
import DevelopmentBanner from "@/components/development-banner";
import { cookie, inter, martianMono } from "@/utils/fonts/next-google";
import { neueHaasDisplay } from "@/utils/fonts/next-local";

export const metadata: Metadata = {
  title: META_TITLE,
  applicationName: META_APP,
  ...(META_DESCRIPTION && { description: META_DESCRIPTION }),
  metadataBase: new URL(BASE_URL),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: META_APP,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    title: META_TITLE,
    ...(META_DESCRIPTION && { description: META_DESCRIPTION }),
    type: "profile",
    siteName: META_APP,
    countryName: "Indonesia",
    locale: "en-US",
    url: `/`,
    images: [
      {
        url: `images/opengraph-image.png`,
        alt: META_TITLE,
        type: "image/png",
        width: 1200,
        height: 630,
      },
    ],
  },
  // twitter: {
  //   card: "summary_large_image",
  //   site: "@CommuterLine",
  //   creator: "@CommuterLine",
  //   creatorId: "341987176",
  //   title: META_TITLE,
  //   ...(META_DESCRIPTION && { description: META_DESCRIPTION }),
  //   images: [
  //     {
  //       url: `images/twitter-image.png`,
  //       alt: META_APP,
  //       type: "image/png",
  //     },
  //   ],
  // },
  creator: "Raihan Yusuf",
  authors: [
    { name: "Raihan Yusuf", url: "https://www.linkedin.com/in/raihan-yusuf" },
  ],
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      url: `/favicon.ico`,
      sizes: "any",
    },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      url: `/ios/180.png`,
      sizes: "180x180",
    },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      url: `/ios/120.png`,
      sizes: "120x120",
    },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      url: `/ios/152.png`,
      sizes: "152x152",
    },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      url: `/ios/1024.png`,
      sizes: "1024x1024",
    },
    {
      rel: "shortcut icon",
      type: "image/x-icon",
      url: `/favicon.ico`,
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${neueHaasDisplay.variable} ${inter.variable} ${martianMono.variable} ${cookie.variable} antialiased ${NODE_ENV === "development" ? "relative" : ""}`}
      >
        <DevelopmentBanner />
        {children}
        <VercelCompatibleComponents.Analytics />
        <VercelCompatibleComponents.SpeedInsights />
      </body>
    </html>
  );
}
