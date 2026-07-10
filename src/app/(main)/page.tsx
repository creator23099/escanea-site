import type { Metadata } from "next";
import { HERO_BG_IMAGE, HERO_BG_IMAGE_MOBILE, HomeContent } from "@/components/pages/HomeContent";
import { heroLcpPreload } from "@/lib/hero-preload";

export const metadata: Metadata = {
  title: "Escanea | Publicidad en Vehículos con Datos Reales — Medellín y Bogotá",
  description:
    "Aumenta el reconocimiento de tu marca en los barrios donde viven tus futuros clientes. Publicidad móvil medible con reportes semanales verificables — Medellín y Bogotá.",
  openGraph: {
    title: "Escanea — Media urbana en movimiento",
    description:
      "Aumenta el reconocimiento de tu marca donde viven tus futuros clientes. Publicidad móvil medible con reportes semanales — Medellín y Bogotá.",
    url: "/",
  },
  icons: heroLcpPreload(HERO_BG_IMAGE_MOBILE, HERO_BG_IMAGE),
};

export default function HomePage() {
  return <HomeContent />;
}
