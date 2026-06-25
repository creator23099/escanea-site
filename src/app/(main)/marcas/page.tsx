import type { Metadata } from "next";
import {
  BrandsContent,
  MARCAS_HERO_BG_IMAGE,
  MARCAS_HERO_BG_IMAGE_MOBILE,
} from "@/components/pages/BrandsContent";
import { heroLcpPreload } from "@/lib/hero-preload";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Publicidad en Vehículos para Marcas | Escanea",
  description:
    "Publicidad exterior en movimiento para marcas. Tu campaña recorre la ciudad con reportes semanales verificables.",
  openGraph: {
    title: "Marcas · Escanea",
    description:
      "Publicidad exterior en movimiento para marcas. Tu campaña recorre la ciudad con reportes semanales verificables.",
    url: ROUTES.marcas,
  },
  icons: heroLcpPreload(MARCAS_HERO_BG_IMAGE_MOBILE, MARCAS_HERO_BG_IMAGE),
};

export default function BrandsPage() {
  return <BrandsContent />;
}
