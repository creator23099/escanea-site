import type { Metadata } from "next";
import { DriversContent } from "@/components/pages/DriversContent";

export const metadata: Metadata = {
  title: "Conductores",
  description:
    "Genera ingresos adicionales mientras conduces. Sin cambiar tus rutas, sin compromisos rígidos.",
  openGraph: {
    title: "Conductores · Escanea",
    description:
      "Genera ingresos adicionales mientras conduces. Sin cambiar tus rutas, sin compromisos rígidos.",
    url: "/drivers",
  },
};

export default function DriversPage() {
  return <DriversContent />;
}
