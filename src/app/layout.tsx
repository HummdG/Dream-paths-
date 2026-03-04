import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dreampaths.co.uk'),
  title: "DreamPaths – Kids Learn Real Skills Through the Career They Love",
  description: "DreamPaths helps kids aged 8–14 discover their dream career through hands-on missions. Pick a path, build real projects, and develop genuine skills — one mission a week.",
  keywords: ["kids coding", "learn Python for kids", "STEM for kids", "kids career learning", "game development for kids", "educational platform", "coding missions", "ages 8-14"],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "DreamPaths – Kids Learn Real Skills Through the Career They Love",
    description: "DreamPaths helps kids aged 8–14 discover their dream career through hands-on missions. Pick a path, build real projects, and develop genuine skills — one mission a week.",
    url: "https://dreampaths.co.uk",
    siteName: "DreamPaths",
    images: ["/logo.svg"],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DreamPaths – Kids Learn Real Skills Through the Career They Love",
    description: "DreamPaths helps kids aged 8–14 discover their dream career through hands-on missions.",
    images: ["/logo.svg"],
  },
  alternates: {
    canonical: "https://dreampaths.co.uk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
