import type { Metadata } from "next";
import { DriversContent } from "@/components/pages/DriversContent";
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
};

export default function DriversPage() {
  return <DriversContent />;
}
