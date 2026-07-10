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
    "Programa Marcas Fundadoras — campañas de publicidad exterior móvil medibles y verificables para negocios en Medellín y Bogotá. Cupos limitados 2026.",
  openGraph: {
    title: "Marcas · Escanea",
    description:
      "Programa Marcas Fundadoras — campañas de publicidad exterior móvil medibles y verificables para negocios en Medellín y Bogotá. Cupos limitados 2026.",
    url: ROUTES.marcas,
  },
  icons: heroLcpPreload(MARCAS_HERO_BG_IMAGE_MOBILE, MARCAS_HERO_BG_IMAGE),
};

export default function BrandsPage() {
  return <BrandsContent />;
}
