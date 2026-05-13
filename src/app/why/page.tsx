import type { Metadata } from "next";
import { WhyContent } from "@/components/pages/WhyContent";

// Per-route `title` is intentionally omitted so the browser tab inherits
// the single root title "Escanea". OpenGraph title remains route-specific
// because that surfaces on social shares, not in the tab.
export const metadata: Metadata = {
  description:
    "El futuro de la publicidad urbana. Una respuesta a la fatiga digital, el costo de vida urbano y la demanda de publicidad física con datos reales.",
  openGraph: {
    title: "Por Qué Ahora · Escanea",
    description:
      "El futuro de la publicidad urbana. Una respuesta a la fatiga digital, el costo de vida urbano y la demanda de publicidad física con datos reales.",
    url: "/why",
  },
};

export default function WhyPage() {
  return <WhyContent />;
}
