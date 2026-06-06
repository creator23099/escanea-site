import type { Metadata } from "next";
import { BrandsContent } from "@/components/pages/BrandsContent";
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
};

export default function BrandsPage() {
  return <BrandsContent />;
}
