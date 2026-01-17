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
  title: "DreamPath Kids - Turn Gaming Passion into Real Skills",
  description: "Guide your child through fun, hands-on missions that turn their love of games into real coding and creative skills. Weekly missions for kids aged 8-12.",
  keywords: ["kids coding", "game development for kids", "learn to code", "educational games", "STEM for kids"],
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
