import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
});

const siteTitle = "DreamPaths – Career Adventures for Kids";
const siteDescription =
  "DreamPaths gives kids of all ages a taste of real careers through hands-on missions. Build games as a Computer Scientist, launch rockets as an Astronaut, or save lives as a Doctor. Every path teaches real skills, one project at a time.";

export const metadata: Metadata = {
  metadataBase: new URL('https://dreampaths.co.uk'),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "career learning for kids",
    "STEM for kids",
    "kids educational platform",
    "learn to code for kids",
    "space exploration for kids",
    "doctor simulator for kids",
    "game development for kids",
    "hands-on learning ages 8-14",
    "career paths for children",
    "kids mission-based learning",
  ],
  icons: {
    icon: [
      { url: "/favicon2.ico", sizes: "any" },
      { url: "/favicon2-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon2-32x32.png", sizes: "32x32", type: "image/png" },
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
    title: siteTitle,
    description: siteDescription,
    url: "https://dreampaths.co.uk",
    siteName: "DreamPaths",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og-image.jpg"],
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
      <body className={`${baloo.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
