import type { Metadata } from "next";
import { BrandsContent } from "@/components/pages/BrandsContent";

export const metadata: Metadata = {
  title: "Publicidad en Vehículos para Marcas | Escanea",
  description:
    "Publicidad exterior en movimiento para marcas. Tu campaña recorre la ciudad con reportes semanales verificables.",
  openGraph: {
    title: "Marcas · Escanea",
    description:
      "Publicidad exterior en movimiento para marcas. Tu campaña recorre la ciudad con reportes semanales verificables.",
    url: "/brands",
  },
};

export default function BrandsPage() {
  return <BrandsContent />;
}
