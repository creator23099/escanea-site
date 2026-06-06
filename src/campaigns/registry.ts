import type { ClientCampaignConfig } from "@/lib/client-campaign";
import { clientConfig as clinicaDentistaPoblado } from "@/campaigns/clinica-dentista-poblado";

const campaigns: Record<string, ClientCampaignConfig> = {
  [clinicaDentistaPoblado.clientSlug]: clinicaDentistaPoblado,
};

export function getCampaignBySlug(slug: string): ClientCampaignConfig | null {
  return campaigns[slug] ?? null;
}

export function getAllCampaignSlugs(): string[] {
  return Object.keys(campaigns);
}
