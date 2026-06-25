import type { Metadata } from "next";
import {
  CONDUCTORES_HERO_BG_IMAGE,
  CONDUCTORES_HERO_BG_IMAGE_MOBILE,
  DriversContent,
} from "@/components/pages/DriversContent";
import { heroLcpPreload } from "@/lib/hero-preload";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Gana Dinero con tu Carro | Conductores Escanea",
  description:
    "Genera ingresos adicionales mientras conduces. Sin cambiar tus rutas, sin compromisos rígidos.",
  openGraph: {
    title: "Conductores · Escanea",
    description:
      "Genera ingresos adicionales mientras conduces. Sin cambiar tus rutas, sin compromisos rígidos.",
    url: ROUTES.conductores,
  },
  icons: heroLcpPreload(CONDUCTORES_HERO_BG_IMAGE_MOBILE, CONDUCTORES_HERO_BG_IMAGE),
};

export default function DriversPage() {
  return <DriversContent />;
}
