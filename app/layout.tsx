import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kaptan Leather — Premium Leather & Combat Sportswear",
    template: "%s · Kaptan Leather",
  },
  description:
    "Hand-finished leather jackets, track-grade racing suits and sublimated combat sportswear. Built in Britain. Shipped worldwide.",
  metadataBase: new URL("https://kaptanleather.co.uk"),
  openGraph: {
    title: "Kaptan Leather",
    description:
      "Hand-finished leather jackets, racing suits and combat sportswear.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
