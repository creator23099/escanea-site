import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollManager } from "@/components/layout/ScrollManager";

/**
 * Fonts are self-hosted via next/font (no external Google Fonts request at runtime),
 * preventing CLS and the previous @import url(...) waterfall inside <style>.
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  // Weights actually used by the design (300-700).
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F5F1",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.escanea.co"),
  title: {
    default: "Escanea — Media urbana en movimiento",
    template: "%s · Escanea",
  },
  description:
    "Publicidad exterior en movimiento. Medible, verificable y presente donde está tu audiencia — todos los días.",
  applicationName: "Escanea",
  keywords: [
    "publicidad",
    "OOH",
    "media urbana",
    "QR",
    "Colombia",
    "Bogotá",
    "Medellín",
    "Escanea",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Escanea",
    title: "Escanea — Media urbana en movimiento",
    description:
      "Transformando el tráfico en atención medible. Publicidad en movimiento con reportes reales.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Escanea — Media urbana en movimiento",
    description:
      "Transformando el tráfico en atención medible. Publicidad en movimiento con reportes reales.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Skip link — visible on keyboard focus, hidden otherwise */}
        <a href="#main-content" className="skip-link">
          Saltar al contenido
        </a>
        <Navbar />
        <ScrollManager />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
