import Image from "next/image";
import type { CSSProperties } from "react";
import type { ClientCampaignConfig } from "@/lib/client-campaign";
import {
  buildWhatsAppLink,
  hasSocialLinks,
  photoPlaceholderLabel,
} from "@/lib/client-campaign";

const WHATSAPP_GREEN = "#25D366";

type ClientCampaignPageProps = {
  config: ClientCampaignConfig;
};

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.92 4.92 0 011.77 1.153 4.92 4.92 0 011.153 1.77c.163.46.349 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.92 4.92 0 01-1.153 1.77 4.92 4.92 0 01-1.77 1.153c-.46.163-1.26.349-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.92 4.92 0 01-1.77-1.153 4.92 4.92 0 01-1.153-1.77c-.163-.46-.349-1.26-.403-2.43C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.92 4.92 0 011.153-1.77 4.92 4.92 0 011.77-1.153c.46-.163 1.26-.349 2.43-.403C8.416 2.175 8.796 2.163 12 2.163M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63a6.6 6.6 0 00-2.385 1.552A6.6 6.6 0 00.63 4.567C.333 5.332.132 6.202.072 7.48.014 8.76 0 9.168 0 12s.014 3.24.072 4.52c.06 1.278.261 2.148.558 2.913a6.6 6.6 0 001.552 2.385 6.6 6.6 0 002.385 1.552c.765.297 1.635.498 2.913.558C8.76 23.986 9.168 24 12 24s3.24-.014 4.52-.072c1.278-.06 2.148-.261 2.913-.558a6.6 6.6 0 002.385-1.552 6.6 6.6 0 001.552-2.385c.297-.765.498-1.635.558-2.913.058-1.28.072-1.688.072-4.52s-.014-3.24-.072-4.52c-.06-1.278-.261-2.148-.558-2.913a6.6 6.6 0 00-1.552-2.385A6.6 6.6 0 0019.433.63C18.668.333 17.798.132 16.52.072 15.24.014 14.832 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function CtaButton({
  href,
  label,
  backgroundColor,
}: {
  href: string;
  label: string;
  backgroundColor: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center justify-center gap-2 rounded-[14px] px-6 py-[18px] text-base font-semibold tracking-[0.01em] text-white transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:brightness-110 active:translate-y-0"
      style={{
        backgroundColor,
        boxShadow: "0 4px 14px rgba(27, 43, 75, 0.25)",
      }}
    >
      <WhatsAppIcon />
      {label}
    </a>
  );
}

type CampaignTheme = {
  text: {
    clinicName: string;
    contextLine: string;
    headline: string;
    subheadline: string;
    services: string;
    socialProofText: string;
    socialProofBg: string;
    socialProofBorder: string;
    sectionTitle: string;
    sectionSubtitle: string;
    footerText: string;
    footerLink: string;
  };
  surface: {
    placeholderBg: string;
    placeholderBorder: string;
    placeholderLabel: string;
    divider: string;
    photoCardBorder: string;
  };
};

const DARK_THEME: CampaignTheme = {
  text: {
    clinicName: "#8B95A3",
    contextLine: "#4B5563",
    headline: "#C9A84C",
    subheadline: "#E5E0D8",
    services: "#4B5563",
    socialProofText: "#C9A84C",
    socialProofBg: "rgba(201, 168, 76, 0.08)",
    socialProofBorder: "rgba(201, 168, 76, 0.2)",
    sectionTitle: "#C9A84C",
    sectionSubtitle: "#4B5563",
    footerText: "#374151",
    footerLink: "#4B5563",
  },
  surface: {
    placeholderBg: "#1A2535",
    placeholderBorder: "#253347",
    placeholderLabel: "#4B5563",
    divider: "#1E2D42",
    photoCardBorder: "#253347",
  },
};

const LIGHT_THEME: CampaignTheme = {
  text: {
    clinicName: "#6B7280",
    contextLine: "#9CA3AF",
    headline: "#0D1A2E",
    subheadline: "#374151",
    services: "#9CA3AF",
    socialProofText: "#374151",
    socialProofBg: "#EEECEA",
    socialProofBorder: "#D9D7D4",
    sectionTitle: "#0D1A2E",
    sectionSubtitle: "#9CA3AF",
    footerText: "#6B7280",
    footerLink: "#6B7280",
  },
  surface: {
    placeholderBg: "#F0EFEC",
    placeholderBorder: "#E8E6E2",
    placeholderLabel: "#9CA3AF",
    divider: "#E8E6E2",
    photoCardBorder: "#E8E6E2",
  },
};

function campaignTheme(config: ClientCampaignConfig): CampaignTheme {
  if (config.isDark) return DARK_THEME;

  return {
    text: {
      ...LIGHT_THEME.text,
      headline: config.secondaryColor,
      sectionTitle: config.secondaryColor,
    },
    surface: LIGHT_THEME.surface,
  };
}

export function ClientCampaignPage({ config }: ClientCampaignPageProps) {
  const waLink = buildWhatsAppLink(config);
  const showSocialProof = Boolean(config.reviewCount);
  const showSocials = hasSocialLinks(config.socials);
  const galleryPhotos = config.photos.length > 0 ? config.photos : [null, null, null, null];
  const { text: TEXT, surface: SURFACE } = campaignTheme(config);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [id="__next-build-watcher"],
            [data-nextjs-portal],
            button[aria-label="Open Next.js Dev Tools"],
            [data-nextjs-dev-tools-button],
            nextjs-portal {
              display: none !important;
            }
          `,
        }}
      />
      <div
        className="min-h-svh text-[#1A1A1A]"
        style={
          {
            backgroundColor: config.backgroundColor,
            "--campaign-primary": config.primaryColor,
            "--campaign-secondary": config.secondaryColor,
          } as CSSProperties
        }
      >
        <div className="mx-auto w-full max-w-lg px-6 pb-8 pt-8 sm:max-w-xl lg:max-w-2xl">
        {/* 1. ABOVE THE FOLD */}
        <header className="flex flex-col items-center gap-[10px] text-center">
          {/* Logo or client name */}
          {config.logo ? (
            <div className="flex justify-center">
              <Image
                src={config.logo}
                alt={config.clientName}
                width={160}
                height={48}
                className="h-12 w-auto object-contain"
                priority
              />
            </div>
          ) : (
            <p
              className="mb-[2px] text-[15px] font-medium uppercase tracking-[0.15em]"
              style={{ color: TEXT.clinicName }}
            >
              {config.clientName}
            </p>
          )}

          {/* Context line */}
          <p
            className="text-[0.8rem] font-normal italic"
            style={{ color: TEXT.contextLine }}
          >
            Escaneaste uno de nuestros vehículos en Medellín
          </p>

          {/* Headline */}
          <h1
            className="my-2 font-[family-name:var(--font-campaign-serif)] text-[3.25rem] font-bold italic leading-[1.1] tracking-[-0.02em]"
            style={{ color: TEXT.headline }}
          >
            {config.headline}
          </h1>

          {/* Subheadline */}
          <p
            className="text-[1.1rem] font-normal tracking-[-0.01em]"
            style={{ color: TEXT.subheadline }}
          >
            {config.subheadline}
          </p>

          {/* Services line */}
          <p
            className="text-xs font-normal tracking-[0.05em]"
            style={{ color: TEXT.services }}
          >
            {config.services}
          </p>

          {/* Social proof pill */}
          {showSocialProof && (
            <div
              className="inline-flex items-center justify-center rounded-full border px-[14px] py-[6px] text-xs font-medium"
              style={{
                color: TEXT.socialProofText,
                backgroundColor: TEXT.socialProofBg,
                borderColor: TEXT.socialProofBorder,
              }}
            >
              ⭐ {config.reviewCount} reseñas 5 estrellas
            </div>
          )}

          {/* Primary CTA */}
          <div className="w-full">
            <CtaButton href={waLink} label={config.ctaText} backgroundColor={WHATSAPP_GREEN} />
          </div>
        </header>

        <div className="py-6" aria-hidden="true">
          <hr className="border-0 border-t" style={{ borderColor: SURFACE.divider }} />
        </div>

        {/* 2. BELOW THE FOLD */}
        <section>
          {/* Gallery title */}
          <h2
            className="mb-1 text-left font-[family-name:var(--font-campaign-serif)] text-2xl font-semibold"
            style={{ color: TEXT.sectionTitle }}
          >
            Nuestro trabajo
          </h2>

          {/* Gallery support line */}
          <p
            className="mb-4 text-[0.8rem] font-normal tracking-[0.03em]"
            style={{ color: TEXT.sectionSubtitle }}
          >
            Resultados reales de pacientes en Medellín
          </p>

          {/* Photo grid */}
          <div className="grid grid-cols-2 gap-2">
            {galleryPhotos.map((photo, index) =>
              photo ? (
                <div
                  key={`photo-${index}`}
                  className="relative aspect-[1/1] aspect-square w-full overflow-hidden rounded-[12px] border"
                  style={{
                    aspectRatio: "1 / 1",
                    borderColor: SURFACE.photoCardBorder,
                  }}
                >
                  <Image
                    src={photo}
                    alt={`Trabajo ${index + 1} — ${config.clientName}`}
                    fill
                    sizes="(max-width: 640px) 175px, 280px"
                    className="object-cover object-center"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div
                  key={`placeholder-${index}`}
                  className="flex aspect-[1/1] aspect-square w-full items-center justify-center overflow-hidden rounded-[12px] border px-2 text-center text-xs leading-tight"
                  style={{
                    aspectRatio: "1 / 1",
                    backgroundColor: SURFACE.placeholderBg,
                    borderColor: SURFACE.placeholderBorder,
                    color: SURFACE.placeholderLabel,
                  }}
                >
                  {photoPlaceholderLabel(index)}
                </div>
              ),
            )}
          </div>

          {/* Second CTA */}
          <div className="mt-6">
            <CtaButton href={waLink} label={config.ctaText} backgroundColor={WHATSAPP_GREEN} />
          </div>
        </section>

        {/* 3. FOOTER */}
        <footer className="mt-10 text-center">
          <p className="text-xs" style={{ color: TEXT.footerText }}>
            Campaña gestionada por{" "}
            <a
              href="https://escanea.co"
              className="underline underline-offset-2 transition-colors duration-200"
              style={{ color: TEXT.footerLink }}
            >
              Escanea
            </a>
          </p>

          {showSocials && config.socials && (
            <div className="mt-3 flex items-center justify-center gap-3">
              {config.socials.instagram && (
                <a
                  href={config.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transition-colors duration-200"
                  style={{ color: TEXT.footerLink }}
                >
                  <InstagramIcon />
                </a>
              )}
              {config.socials.facebook && (
                <a
                  href={config.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="transition-colors duration-200"
                  style={{ color: TEXT.footerLink }}
                >
                  <FacebookIcon />
                </a>
              )}
            </div>
          )}
        </footer>
      </div>
      </div>
    </>
  );
}
