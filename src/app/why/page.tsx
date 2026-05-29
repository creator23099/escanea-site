import type { Metadata } from "next";
import { WhyContent } from "@/components/pages/WhyContent";

export const metadata: Metadata = {
  title: "Por Qué la Publicidad Vehicular es el Futuro | Escanea",
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
