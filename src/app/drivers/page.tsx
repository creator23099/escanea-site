import type { Metadata } from "next";
import { DriversContent } from "@/components/pages/DriversContent";

// Per-route `title` is intentionally omitted so the browser tab inherits
// the single root title "Escanea". OpenGraph title remains route-specific
// because that surfaces on social shares, not in the tab.
export const metadata: Metadata = {
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
