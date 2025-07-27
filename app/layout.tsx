import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
// Added ThemeProvider for dark mode support
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "screeny.dev",
  description:
    "Transform your screenshots with beautiful backgrounds and rounded corners",
  generator: "screeny.dev",
  icons: {
    icon: "/favicon.ico",
  },
  // Added Open Graph metadata for social media sharing
  openGraph: {
    title: "screeny.dev",
    description:
      "Transform your screenshots with beautiful backgrounds and rounded corners",
    url: "https://screeny.dev",
    siteName: "screeny.dev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "screeny.dev - Transform your screenshots with beautiful backgrounds",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Added Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "screeny.dev",
    description:
      "Transform your screenshots with beautiful backgrounds and rounded corners",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      {/* Added ThemeProvider to support dark mode */}
      <body>
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
