import type { Metadata } from "next";
import { BrandsContent } from "@/components/pages/BrandsContent";

// Per-route `title` is intentionally omitted so the browser tab inherits
// the single root title "Escanea". OpenGraph title remains route-specific
// because that surfaces on social shares, not in the tab.
export const metadata: Metadata = {
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
