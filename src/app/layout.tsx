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
  title: "DreamPaths – Help Your Child Discover Their Dream Career",
  description: "DreamPaths helps kids aged 8-14 explore the career they want through weekly hands-on missions. Each path builds real, applicable skills one project at a time.",
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
    title: "DreamPaths – Help Your Child Discover Their Dream Career",
    description: "DreamPaths helps kids aged 8-14 explore the career they want through weekly hands-on missions. Each path builds real, applicable skills one project at a time.",
    url: "https://dreampaths.co.uk",
    siteName: "DreamPaths",
    images: ["/logo.svg"],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DreamPaths – Help Your Child Discover Their Dream Career",
    description: "DreamPaths helps kids aged 8-14 explore the career they want through weekly hands-on missions. Each path builds real, applicable skills one project at a time.",
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
