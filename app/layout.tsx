import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { CheckerboardStripe } from "@/components/checkerboard-stripe";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["900"],
});

export const metadata: Metadata = {
  title: "Lambre-Bull, handcrafted Lambrettas from Spain to Australia",
  description:
    "Lambre-Bull builds custom Lambrettas in Spain and ships them to Australia. Browse available bikes, configure your own, get in touch.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#f2f2ee] antialiased">
        <Nav />
        <CheckerboardStripe height={8} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <CheckerboardStripe height={8} />
        <SiteFooter />
      </body>
    </html>
  );
}
