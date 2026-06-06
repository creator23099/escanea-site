import type { Metadata } from "next";
import { HomeContent } from "@/components/pages/HomeContent";

export const metadata: Metadata = {
  title: "Escanea | Publicidad en Vehículos con Datos Reales — Medellín y Bogotá",
  description:
    "Publicidad en vehículos que circulan por Medellín y Bogotá todos los días. Medible con QR, verificable con reportes semanales.",
  openGraph: {
    title: "Escanea — Media urbana en movimiento",
    description:
      "Transformando el tráfico en atención medible. Publicidad en movimiento con reportes reales.",
    url: "/",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
