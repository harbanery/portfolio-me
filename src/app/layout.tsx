import "../assets/global/index.css";
import type { Metadata } from "next";
import { neueHaasDisplay } from "@/utils/fonts/neue-haas";
import {
  BASE_URL,
  META_APP,
  META_DESCRIPTION,
  META_TITLE,
  NODE_ENV,
} from "@/lib/config/variables";
import { bebas, inter } from "@/utils/fonts/next-google";

export const metadata: Metadata = {
  title: META_TITLE,
  applicationName: META_APP,
  ...(META_DESCRIPTION && { description: META_DESCRIPTION }),
  metadataBase: new URL(BASE_URL),
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
    alternateLocale: "id-ID",
    url: `/`,
    images: [
      {
        url: `images/opengraph-image.png`,
        alt: META_APP,
        type: "image/png",
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
  authors: [{ name: "Raihan Yusuf" }],
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      url: `/favicon.ico`,
      sizes: "any",
    },
    {
      rel: "apple-touch-icon",
      type: "image/x-icon",
      url: `/favicon.ico`,
    },
    {
      rel: "shortcut icon",
      type: "image/x-icon",
      url: `/favicon.ico`,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Critical CSS inlining for above-the-fold content */}
        <style jsx>{`
          :root {
            --foreground: 222 184 135;
            --background: 0 0 0;
            --card: 0 0 0;
            --card-foreground: 222 184 135;
            --popover: 0 0 0;
            --popover-foreground: 222 184 135;
            --primary: 222 184 135;
            --primary-foreground: 0 0 0;
            --secondary: 240 240 240;
            --secondary-foreground: 0 0 0;
            --muted: 240 240 240;
            --muted-foreground: 0 0 0;
            --accent: 240 240 240;
            --accent-foreground: 0 0 0;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 0 0 0;
            --border: 240 240 240;
            --input: 240 240 240;
            --ring: 222 184 135;
            --chart-1: 12 76 171;
            --chart-2: 173 96 60;
            --chart-3: 197 134 192;
            --chart-4: 43 108 176;
            --chart-5: 46 213 115;
          }
          * {
            @apply border-border;
          }
          body {
            @apply bg-background text-foreground;
          }
        `}</style>
        {META_DESCRIPTION && (
          <meta name="description" content={META_DESCRIPTION} />
        )}
      </head>

      <body
        className={`${neueHaasDisplay.variable} ${inter.variable} ${bebas.variable} antialiased ${NODE_ENV === "development" ? "relative" : ""}`}
      >
        {NODE_ENV === "development" && (
          <div className="font-inter fixed top-10 -right-10 z-[99999] text-white px-10 py-1 bg-red-600 rotate-45">
            DEVELOPMENT
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
