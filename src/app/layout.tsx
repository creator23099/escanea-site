import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

/**
 * Fonts are self-hosted via next/font (no external Google Fonts request at runtime),
 * preventing CLS and the previous @import url(...) waterfall inside <style>.
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  // Weights actually used by the design (400-700).
  weight: ["400", "500", "600", "700"],
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
    default: "Escanea",
    template: "%s",
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
  // Explicit icon declaration. We DO NOT rely on Next.js inferring icons
  // purely from the file convention, because Safari (desktop + iOS) has
  // a history of silently falling back to /favicon.ico or refusing to
  // refresh a stale SVG favicon. Listing icon + shortcut + apple-touch-
  // icon as explicit metadata guarantees the head exposes every rel a
  // Safari version may look for, and lets us reference the PNG variants
  // we generate via app/icon.tsx and app/apple-icon.tsx.
  icons: {
    icon: [
      { url: "/icon", type: "image/png", sizes: "32x32" },
    ],
    shortcut: ["/icon"],
    apple: [
      { url: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  },
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
      <body className="min-h-full w-full flex flex-col overflow-x-hidden">
        {/* Skip link — visible on keyboard focus, hidden otherwise */}
        <a href="#main-content" className="skip-link">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
