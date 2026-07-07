import dynamic from "next/dynamic";
import { Accordion } from "@/components/primitives/Accordion";
import { FadeUpSection } from "@/components/primitives/FadeUpSection";
import { HeroBackgroundImage } from "@/components/primitives/HeroBackgroundImage";
import { ReportList } from "@/components/primitives/ReportList";
import { ScrollToIdButton } from "@/components/primitives/ScrollToIdButton";
import { NetworkStatsGrid } from "@/components/primitives/NetworkStatsGrid";
import { Tag } from "@/components/primitives/Tag";
import { MARCAS_STATS_BAR } from "@/lib/network-stats";
import { T } from "@/lib/tokens";
import type { AccordionItem } from "@/lib/types";
import type { CSSProperties } from "react";

const BrandsContactForm = dynamic(() =>
  import("./BrandsContactForm").then((mod) => mod.BrandsContactForm)
);

const BRANDS_FAQ: AccordionItem[] = [
  {
    q: "¿Cómo se mide mi campaña?",
    a: "Cada vehículo lleva un código QR único. Medimos escaneos, zonas recorridas, kilómetros activos y conversaciones de WhatsApp generadas. Recibes un reporte semanal con datos reales — no estimaciones.",
  },
  {
    q: "¿Dónde va a circular mi marca?",
    a: "Tú defines las zonas según tu objetivo: residenciales, comerciales o corporativas. Seleccionamos vehículos cuyas rutas coinciden con donde está tu audiencia.",
  },
  {
    q: "¿Quiénes son los conductores?",
    a: "Conductores activos y verificados de Uber, DiDi e InDrive, con mínimo 3 meses de experiencia y vehículos en buen estado. Es una red curada, no una plataforma masiva.",
  },
  {
    q: "¿Mi marca aparecerá junto a contenido inapropiado?",
    a: "No. Trabajamos solo con campañas de marcas profesionales. No aceptamos alcohol, tabaco, apuestas ni contenido que comprometa tu imagen.",
  },
  {
    q: "¿Cuánto dura una campaña?",
    a: "Campañas desde 3 meses. Sin permanencia obligatoria más allá del ciclo.",
  },
  {
    q: "¿Qué pasa si no veo resultados?",
    a: "Por eso medimos todo. Recibes datos semanales reales para evaluar tu inversión desde la primera semana — no esperas al final para saber qué pasó.",
  },
  {
    q: "¿Cómo empiezo?",
    a: "Llena el formulario con tu ciudad y objetivos. Nuestro equipo te contacta en menos de 24 horas para activar tu campaña.",
  },
];

const PROBLEM_COLUMNS = [
  {
    label: "Publicidad digital",
    text: "Ignorada por saturación. Bloqueada por hábito. El usuario promedio ignora la mayoría de anuncios que ve.",
  },
  {
    label: "Vallas tradicionales",
    text: "Un punto fijo. Sin datos. Sin saber quién vio tu mensaje ni cuántas veces generó atención real.",
  },
  {
    label: "Inversión desperdiciada",
    text: "Gastas sin visibilidad real. Sin reportes verificables. Sin saber si tu presupuesto llegó a tu audiencia.",
  },
] as const;

const CAMPAIGN_STEPS = [
  { n: "01", t: "Eliges zona y objetivo", d: "Definimos dónde debe estar tu marca según tu audiencia y metas de campaña." },
  { n: "02", t: "Activamos publicidad en flota activa", d: "Publicidad vehicular en vehículos verificados que circulan todos los días." },
  { n: "03", t: "Tu marca circula con QR único", d: "Cada vehículo lleva un código QR para medir interacción y alcance en tiempo real." },
  { n: "04", t: "Recibes reportes semanales verificables", d: "Kilómetros, zonas, escaneos y conversaciones — datos reales cada semana." },
] as const;

export const MARCAS_HERO_BG_IMAGE = "/images/marcas-hero.webp";
export const MARCAS_HERO_BG_IMAGE_MOBILE = "/images/marcas-hero-vertical.webp";

const MARCAS_HERO_GRADIENT =
  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.15) 100%)";

const FOUNDING_BENEFITS = [
  "Tarifa bloqueada al renovar",
  "Exclusividad de nicho en tu zona durante la campaña",
  "Prioridad en nuevas zonas y ciudades",
  "Cupos limitados — primeras marcas en la ciudad",
] as const;

const FRAUD_PROTECTION_ITEMS = [
  {
    label: "Check-ins fotográficos",
    desc: "Evidencia visual durante la activación y el ciclo activo de campaña.",
  },
  {
    label: "Conductores verificados",
    desc: "Trabajamos con conductores evaluados antes de asignarlos a una campaña.",
  },
  {
    label: "Verificación de campaña",
    desc: "Confirmamos que la campaña esté activa y visible según lo acordado.",
  },
  {
    label: "Confirmación de ubicación",
    desc: "Validamos presencia en zonas relevantes para tu objetivo de cobertura.",
  },
  {
    label: "Monitoreo de campaña activa",
    desc: "Damos seguimiento a la operación para mantener control durante el ciclo.",
  },
] as const;

const inner: CSSProperties = { maxWidth: 680, margin: "0 auto" };

const sectionIvory: CSSProperties = { background: T.ivory, padding: "3.5rem 1.25rem" };

const sectionWhite: CSSProperties = { background: T.white, padding: "3.5rem 1.25rem" };

const bodyMd: CSSProperties = {
  fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.95rem",
  color: T.inkMd,
  lineHeight: 1.75,
};

const h2Brands: CSSProperties = {
  fontFamily: "'DM Serif Display',serif",
  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
  color: T.ink,
  lineHeight: 1.2,
  margin: "1rem 0 1.75rem",
};

const faqPanelShell: CSSProperties = {
  background: T.ivoryDk,
  borderRadius: 12,
  border: `1.5px solid ${T.stone}`,
  padding: "clamp(24px, 5vw, 32px)",
  overflow: "hidden",
};

const cardShell: CSSProperties = {
  background: T.white,
  border: `1.5px solid ${T.stone}`,
  borderRadius: 12,
  padding: "1.5rem",
};

export function BrandsContent() {
  return (
    <div style={{ background: T.ivory }}>
      <section
        className="marcas-hero"
        aria-label="Campaña para marcas"
        style={{
          minHeight: "90vh",
          height: "90vh",
          paddingTop: 60,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <HeroBackgroundImage
          desktopSrc={MARCAS_HERO_BG_IMAGE}
          mobileSrc={MARCAS_HERO_BG_IMAGE_MOBILE}
          alt="Vehículo con publicidad de marca circulando por la ciudad"
        />
        <div aria-hidden="true" className="marcas-hero-gradient-top" />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: MARCAS_HERO_GRADIENT,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          className="marcas-hero-content"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 10,
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <div className="marcas-hero-top">
            <div className="marcas-hero-tag-pill" style={{ animation: "fadeIn 0.6s ease 0.1s both", marginBottom: "1.2rem" }}>
              <Tag>Para Marcas</Tag>
            </div>
            <h1
              className="marcas-hero-headline"
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
                lineHeight: 1.1,
                color: "#FFFFFF",
                marginBottom: "1rem",
                animation: "fadeUp 0.7s ease 0.25s both",
              }}
            >
              ¿Y si el tráfico
              <br />
              <em
                className="marcas-hero-tagline"
                style={{
                  color: T.cobalt,
                  fontStyle: "italic",
                  display: "block",
                }}
              >
                sí funcionara?
              </em>
            </h1>
          </div>

          <div className="marcas-hero-bottom">
            <p
              style={{
                fontSize: "1rem",
                color: "#FFFFFF",
                lineHeight: 1.75,
                maxWidth: 480,
                margin: "0 auto 2rem",
                animation: "fadeUp 0.7s ease 0.38s both",
              }}
            >
              Tu campaña recorre la ciudad en vehículos reales. Medible, verificable y presente donde está tu audiencia.
            </p>
            <div
              className="marcas-hero-ctas"
              style={{ animation: "fadeUp 0.7s ease 0.5s both" }}
            >
              <ScrollToIdButton className="btn btn-primary" targetId="brands-form">
                Activar campaña →
              </ScrollToIdButton>
            </div>
          </div>
        </div>
      </section>

      <FadeUpSection style={sectionWhite} innerStyle={inner} aria-label="Cifras de la red">
          <NetworkStatsGrid stats={MARCAS_STATS_BAR} variant="cards" />
      </FadeUpSection>

      <FadeUpSection style={sectionIvory} innerStyle={inner} aria-label="El problema">
          <Tag>El contexto</Tag>
          <h2 style={h2Brands}>No toda inversión publicitaria llega a tu audiencia.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PROBLEM_COLUMNS.map((col) => (
              <div key={col.label} className="cmp-bad">
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.inkLt, marginBottom: "0.6rem" }}>
                  {col.label}
                </div>
                <p style={{ fontSize: "0.87rem", color: T.inkMd, lineHeight: 1.7, margin: 0 }}>{col.text}</p>
              </div>
            ))}
          </div>
      </FadeUpSection>

      <FadeUpSection style={sectionWhite} innerStyle={inner} aria-label="Cómo funciona una campaña">
          <Tag>Cómo funciona</Tag>
          <h2 style={h2Brands}>Tu campaña en cuatro pasos.</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {CAMPAIGN_STEPS.map(({ n, t, d }) => (
              <div key={n} style={{ ...cardShell, display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <div
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: "1.5rem",
                    color: T.cobalt,
                    opacity: 0.55,
                    lineHeight: 1,
                    paddingTop: 2,
                  }}
                >
                  {n}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: T.ink, marginBottom: "0.35rem" }}>{t}</div>
                  <div style={{ fontSize: "0.87rem", color: T.inkMd, lineHeight: 1.7 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
      </FadeUpSection>

      <FadeUpSection style={sectionIvory} innerStyle={inner} aria-label="Seguridad de marca">
          <Tag>Curación</Tag>
          <h2 style={{ ...h2Brands, marginBottom: "1rem" }}>Tu marca, en buenas manos.</h2>
          <p style={{ ...bodyMd, margin: 0 }}>
            Trabajamos solo con conductores verificados y campañas de marcas profesionales. No aceptamos alcohol, tabaco, apuestas ni contenido que comprometa tu imagen.
          </p>
      </FadeUpSection>

      <FadeUpSection style={sectionWhite} innerStyle={inner} aria-label="Marcas fundadoras">
          <Tag>Oportunidad</Tag>
          <h2 style={{ ...h2Brands, marginBottom: "1rem" }}>Marcas fundadoras.</h2>
          <p style={{ ...bodyMd, marginTop: 0, marginBottom: "1.25rem" }}>
            Cupos limitados disponibles en Medellín.
          </p>
          <p style={{ ...bodyMd, marginTop: 0, marginBottom: "1rem", fontWeight: 600, color: T.ink }}>
            Lo que incluye ser marca fundadora:
          </p>
          <div
            style={{
              background: T.ivoryDk,
              borderRadius: 16,
              border: `1.5px solid ${T.stone}`,
              overflow: "hidden",
            }}
          >
            {FOUNDING_BENEFITS.map((item, i) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderBottom: i < FOUNDING_BENEFITS.length - 1 ? `1px solid ${T.stone}` : "none",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: "1.15rem",
                    color: T.cobalt,
                    opacity: 0.55,
                    lineHeight: 1,
                    minWidth: "1.6rem",
                    paddingTop: 2,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontWeight: 600, fontSize: "0.88rem", color: T.ink, lineHeight: 1.6 }}>{item}</div>
              </div>
            ))}
          </div>
      </FadeUpSection>

      <FadeUpSection style={sectionIvory} innerStyle={inner} aria-label="Reportes semanales">
          <Tag>Reportes reales. No estimaciones.</Tag>
          <h2 style={{ ...h2Brands, marginBottom: "1.5rem" }}>Lo que recibes cada semana.</h2>
          <ReportList />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <ScrollToIdButton className="btn btn-primary" targetId="brands-form" style={{ fontSize: "0.78rem" }}>
              Activar campaña →
            </ScrollToIdButton>
          </div>
      </FadeUpSection>

      <FadeUpSection style={sectionWhite} innerStyle={inner} aria-label="Protección contra fraude">
          <Tag>Verificación</Tag>
          <h2 style={{ ...h2Brands, marginBottom: "1.5rem" }}>Protección contra fraude.</h2>
          <p style={{ ...bodyMd, marginTop: 0, marginBottom: "1.25rem" }}>
            Cada campaña incluye controles para confirmar que la ejecución sea real, visible y monitoreada durante el ciclo activo.
          </p>
          <div
            style={{
              background: T.ivoryDk,
              borderRadius: 16,
              border: `1.5px solid ${T.stone}`,
              overflow: "hidden",
            }}
          >
            {FRAUD_PROTECTION_ITEMS.map((item, i) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderBottom: i < FRAUD_PROTECTION_ITEMS.length - 1 ? `1px solid ${T.stone}` : "none",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: "1.15rem",
                    color: T.cobalt,
                    opacity: 0.55,
                    lineHeight: 1,
                    minWidth: "1.6rem",
                    paddingTop: 2,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.88rem", color: T.ink }}>{item.label}</div>
                  <div style={{ fontSize: "0.8rem", color: T.inkLt, marginTop: "0.1rem", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
      </FadeUpSection>

      <FadeUpSection style={sectionIvory} innerStyle={inner} aria-label="Preguntas frecuentes">
          <Tag>FAQ</Tag>
          <h2 style={{ ...h2Brands, marginBottom: "1.25rem" }}>Preguntas frecuentes.</h2>
          <div style={faqPanelShell}>
            <Accordion items={BRANDS_FAQ} />
          </div>
      </FadeUpSection>

      <BrandsContactForm />
    </div>
  );
}
