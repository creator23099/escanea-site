export type ClientCampaignSocials = {
  instagram: string | null;
  facebook: string | null;
} | null;

export type ClientCampaignConfig = {
  clientName: string;
  clientSlug: string;
  logo: string | null;
  headline: string;
  subheadline: string;
  services: string;
  reviewCount: string | null;
  offer: string;
  whatsappNumber: string;
  ctaText: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  isDark: boolean;
  photos: (string | null)[];
  socials: ClientCampaignSocials;
};

const PHOTO_PLACEHOLDER_LABELS = [
  "Foto antes 1",
  "Foto después 1",
  "Foto antes 2",
  "Foto después 2",
  "Foto antes 3",
  "Foto después 3",
] as const;

export function photoPlaceholderLabel(index: number): string {
  return PHOTO_PLACEHOLDER_LABELS[index] ?? `Foto ${index + 1}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return [0, 0, 0];
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const l1 = relativeLuminance(foreground);
  const l2 = relativeLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** White button text must meet WCAG AA (4.5:1) on the CTA background. */
export function resolveCtaColor(primaryColor: string): string {
  return contrastRatio("#FFFFFF", primaryColor) >= 4.5 ? primaryColor : "#0A84FF";
}

export function buildWhatsAppLink(config: ClientCampaignConfig): string {
  const message = `Hola, vi el anuncio en un vehículo Escanea y quiero ${config.offer}`;
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function hasSocialLinks(socials: ClientCampaignSocials): boolean {
  if (!socials) return false;
  return Boolean(socials.instagram || socials.facebook);
}
