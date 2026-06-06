/**
 * ← EDIT THIS ONLY. Duplicate this file and update for each new client,
 * then register the slug in src/campaigns/registry.ts.
 */
import type { ClientCampaignConfig } from "@/lib/client-campaign";

export const clientConfig: ClientCampaignConfig = {
  clientName: "Clínica Dentista Poblado",
  clientSlug: "clinica-dentista-poblado",
  logo: null,
  headline: "Tu sonrisa ideal.",
  subheadline: "Empieza con una valoración gratuita.",
  services: "Diseño de sonrisa · Carillas · Implantes · Blanqueamiento",
  reviewCount: "+320",
  offer: "una valoración de diseño de sonrisa gratuita",
  whatsappNumber: "573026691241",
  ctaText: "Agendar por WhatsApp",
  primaryColor: "#C9A84C",
  secondaryColor: "#F5F0E8",
  backgroundColor: "#0D1520",
  isDark: true,
  photos: [null, null, null, null],
  socials: {
    instagram: null,
    facebook: null,
  },
};
