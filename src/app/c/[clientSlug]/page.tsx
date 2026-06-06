import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientCampaignPage } from "@/components/pages/ClientCampaignPage";
import { getAllCampaignSlugs, getCampaignBySlug } from "@/campaigns/registry";

type PageProps = {
  params: Promise<{ clientSlug: string }>;
};

export function generateStaticParams() {
  return getAllCampaignSlugs().map((clientSlug) => ({ clientSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { clientSlug } = await params;
  const config = getCampaignBySlug(clientSlug);
  if (!config) return { title: "No encontrado" };

  return {
    title: `${config.headline} | ${config.clientName}`,
    description: config.subheadline,
    robots: "noindex, nofollow",
    openGraph: {
      title: config.headline,
      description: config.subheadline,
      url: `/c/${config.clientSlug}`,
    },
  };
}

export default async function ClientCampaignRoute({ params }: PageProps) {
  const { clientSlug } = await params;
  const config = getCampaignBySlug(clientSlug);
  if (!config) notFound();

  return <ClientCampaignPage config={config} />;
}
