"use client";
import Link from "next/link";
import { Accordion } from "@/components/primitives/Accordion";
import { DarkTag } from "@/components/primitives/DarkTag";
import { HomeLaunchVideo } from "@/components/primitives/HomeLaunchVideo";
import launchStyles from "./HomeLaunchSection.module.css";
import { ReportList } from "@/components/primitives/ReportList";
import { Tag } from "@/components/primitives/Tag";
import { T } from "@/lib/tokens";
import { ROUTES } from "@/lib/routes";
import type { AccordionItem } from "@/lib/types";
import { useInView } from "@/lib/use-in-view";

const HOME_WHY_ITEMS: AccordionItem[] = [
  {
    q: "Exposición repetida",
    a: "La repetición genera reconocimiento. Tu marca aparece constantemente en distintos puntos de la ciudad, construyendo familiaridad de marca en contextos reales.",
  },
  {
    q: "Movimiento urbano real",
    a: "A diferencia de la publicidad estática, Escanea circula donde vive, trabaja y se mueve tu audiencia — sin depender de que el cliente llegue hasta el anuncio.",
  },
  {
    q: "Publicidad medible",
    a: "Las campañas incluyen seguimiento QR y reportes semanales verificables. Por primera vez, la publicidad física tiene datos reales.",
  },
  {
    q: "Cobertura por zonas",
    a: "Las campañas pueden enfocarse en barrios y zonas específicas según tus objetivos: zonas residenciales, comerciales o corporativas.",
  },
];

const HOW_STEPS = [
  {
    n: "01",
    t: "Publicidad en flota activa",
    d: "Publicidad vehicular activada en vehículos que circulan por zonas estratégicas de la ciudad.",
  },
  {
    n: "02",
    t: "Circulación diaria con QR",
    d: "Cada vehículo lleva un QR único. Tu campaña se mueve todos los días por múltiples zonas urbanas.",
  },
  {
    n: "03",
    t: "Reportes verificables",
    d: "Recibes reportes semanales reales: kilómetros, zonas, escaneos, conversaciones WhatsApp y fotografías.",
  },
];

const HERO_BG_IMAGE = "/images/fleet-medellin-horizontal.jpg";
const HERO_BG_IMAGE_MOBILE = "/images/fleet-medellin-vertical.jpg";

const HERO_GRADIENT =
  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.15) 100%)";

const COMPARISON_ROWS = [
  {
    bad: {
      label: "Publicidad estática",
      text: "Un punto fijo. Mismo lugar. Espera a que tu audiencia pase.",
    },
    good: {
      label: "Escanea",
      text: "Tu campaña recorre la ciudad. Zonas residenciales, comerciales y corporativas.",
    },
  },
  {
    bad: {
      label: "Publicidad digital",
      text: "Ignorada por saturación. Bloqueada por hábito.",
    },
    good: {
      label: "Escanea",
      text: "Atención física real. Exposición repetida. QR medible.",
    },
  },
];

export function HomeContent() {
  const [r1, v1] = useInView<HTMLElement>();
  const [r2, v2] = useInView<HTMLElement>();
  const [r3, v3] = useInView<HTMLElement>();
  const [r4, v4] = useInView<HTMLElement>();

  return (
    <div style={{ background: T.ivory }}>
      {/* -- HERO --------------------------------------------------------------- */}
      <section
        className="home-hero"
        aria-label="Bienvenida — flota activa de vehículos con publicidad en Medellín"
        style={{
          minHeight: "90vh",
          height: "90vh",
          paddingTop: 60,
          paddingBottom: 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <picture
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <source media="(max-width: 768px)" srcSet={HERO_BG_IMAGE_MOBILE} />
          <img
            src={HERO_BG_IMAGE}
            alt="Vehículos de Escanea circulando por Medellín con publicidad vehicular"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "right center",
            }}
          />
        </picture>
        <div
          aria-hidden="true"
          className="home-hero-gradient-top"
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: HERO_GRADIENT,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
        <div
          className="home-hero-content"
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "80%",
            width: "100%",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          <div className="home-hero-top">
            <h1
              className="home-hero-headline"
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(3.2rem, 5.5vw, 5.2rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                marginBottom: "1.1rem",
                animation: "fadeUp 0.7s ease 0.25s both",
              }}
            >
              Tu marca recorre la ciudad.
              <br />
              <em
                className="home-hero-tagline"
                style={{
                  color: T.cobalt,
                  fontStyle: "italic",
                  display: "block",
                }}
              >
                Con datos reales.
              </em>
            </h1>
          </div>

          <div className="home-hero-bottom">
            <p
              style={{
                fontSize: "1.05rem",
                fontWeight: 400,
                color: "#FFFFFF",
                lineHeight: 1.7,
                maxWidth: 480,
                margin: "0 auto 2.2rem",
                animation: "fadeUp 0.7s ease 0.38s both",
              }}
            >
              Publicidad en vehículos que circulan por Medellín y Bogotá todos los días. Medible con QR, verificable con reportes semanales. No más adivinanzas.
            </p>

            <div
              className="home-hero-ctas"
              style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", animation: "fadeUp 0.7s ease 0.5s both" }}
            >
              <Link href={ROUTES.marcas} scroll={false} className="btn btn-primary">
                Anunciar mi marca
              </Link>
              <Link
                href={ROUTES.conductores}
                scroll={false}
                className="btn"
                style={{
                  background: "#FFFFFF",
                  color: T.navy,
                  border: "2px solid #FFFFFF",
                  padding: "0.9rem 1.6rem",
                }}
              >
                Conducir con Escanea
              </Link>
            </div>

            <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", justifyContent: "center", marginTop: "2.5rem", animation: "fadeUp 0.7s ease 0.62s both" }}>
              {["Reportes semanales", "QR medible", "Sin contratos largos"].map((t) => (
                <div
                  key={t}
                  style={{
                    padding: "0.35rem 0.85rem",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid #fff",
                    borderRadius: 20,
                    fontSize: "0.75rem",
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -- CÓMO FUNCIONA ------------------------------------------------------ */}
      <section ref={r1} style={{ background: T.navy, padding: "100px 1.25rem 4rem" }} aria-label="Cómo funciona">
        <div className={`fade-up ${v1 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ marginBottom: "1.2rem" }}>
            <DarkTag>Activando nuestras primeras campañas en Colombia</DarkTag>
          </div>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.9rem, 5vw, 3rem)",
              color: "#fff",
              lineHeight: 1.15,
              margin: "1rem 0 1rem",
            }}
          >
            El movimiento<br />
            <em style={{ color: "rgba(150,180,255,0.9)" }}>captura la atención.</em>
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 520 }}>
            Mientras la publicidad digital se ignora y los billboards tradicionales permanecen estáticos,
            nuestros vehículos recorren la ciudad — donde vive, trabaja y transita tu audiencia.
          </p>

          <ol style={{ display: "flex", flexDirection: "column", gap: 0, listStyle: "none" }}>
            {HOW_STEPS.map((s, i) => (
              <li
                key={s.n}
                style={{
                  display: "flex",
                  gap: "1.25rem",
                  alignItems: "flex-start",
                  padding: "1.5rem 0",
                  borderBottom: i < HOW_STEPS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: "1.5rem",
                    color: "rgba(26,79,214,0.5)",
                    lineHeight: 1,
                    paddingTop: 2,
                  }}
                >
                  {s.n}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff", marginBottom: "0.35rem", fontSize: "0.95rem" }}>{s.t}</div>
                  <div style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{s.d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -- VIDEO + COMPARISON --------------------------------------------------- */}
      <section
        style={{ background: T.ivory, padding: "4rem 1.25rem" }}
        aria-label="Campaña en acción y comparación"
      >
        <div className={launchStyles.inner}>
          <div className={launchStyles.grid}>
            <div className={launchStyles.media}>
              <HomeLaunchVideo />
            </div>
            <div className={launchStyles.copy}>
              <Tag>La diferencia</Tag>
              <h2
                style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: "clamp(1.7rem, 4.5vw, 2.6rem)",
                  color: T.ink,
                  lineHeight: 1.15,
                  margin: "1rem 0 1.25rem",
                }}
              >
                No toda publicidad funciona igual.
              </h2>

              <div className={launchStyles.compareStack}>
                {COMPARISON_ROWS.map((row, i) => (
                  <div key={i} className={launchStyles.comparePair}>
                    <div className={launchStyles.compareMuted}>
                      <div className={launchStyles.compareLabelMuted}>{row.bad.label}</div>
                      <p className={launchStyles.compareTextMuted}>{row.bad.text}</p>
                    </div>
                    <div className={launchStyles.compareHighlight}>
                      <div className={launchStyles.compareLabelHighlight}>{row.good.label}</div>
                      <p className={launchStyles.compareTextHighlight}>{row.good.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href={ROUTES.marcas} scroll={false} className="btn btn-primary">
                Anunciar mi marca
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -- WHY IT WORKS ------------------------------------------------------- */}
      <section ref={r2} style={{ background: T.white, padding: "4rem 1.25rem" }}>
        <div className={`fade-up ${v2 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>Cómo funciona</Tag>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.7rem, 4.5vw, 2.6rem)",
              color: T.ink,
              lineHeight: 1.15,
              margin: "1rem 0 2rem",
            }}
          >
            Diseñado para<br />resultados reales.
          </h2>
          <Accordion items={HOME_WHY_ITEMS} />
        </div>
      </section>

      {/* -- SPLIT CTA ---------------------------------------------------------- */}
      <section ref={r3} style={{ background: T.ivory, padding: "4rem 1.25rem" }}>
        <div className={`fade-up ${v3 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { label: "Para Marcas",      h: "Transforma tráfico urbano en atención medible.", cta: "Anunciar mi marca",    href: ROUTES.marcas,  accent: true  },
              { label: "Para Conductores", h: "Genera ingresos sin cambiar tus rutas.",          cta: "Conducir con Escanea", href: ROUTES.conductores, accent: false },
            ].map((c) => (
              <div
                key={c.label}
                style={{
                  background: c.accent ? T.navy : T.white,
                  border: `1.5px solid ${c.accent ? T.navy : T.stone}`,
                  borderRadius: 16,
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent ? "rgba(150,185,255,0.7)" : T.inkLt }}>
                  {c.label}
                </div>
                <h3
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
                    color: c.accent ? "#fff" : T.ink,
                    lineHeight: 1.3,
                    flex: 1,
                  }}
                >
                  {c.h}
                </h3>
                <Link
                  href={c.href}
                  scroll={false}
                  className={`btn ${c.accent ? "btn-outline" : "btn-primary"}`}
                  style={
                    c.accent
                      ? { border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "0.72rem", padding: "0.75rem 1rem" }
                      : { fontSize: "0.72rem", padding: "0.75rem 1rem" }
                  }
                >
                  {c.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- REPORTING ---------------------------------------------------------- */}
      <section ref={r4} style={{ background: T.white, padding: "4rem 1.25rem" }}>
        <div className={`fade-up ${v4 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>Reportes reales</Tag>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.7rem, 4.5vw, 2.6rem)",
              color: T.ink,
              lineHeight: 1.15,
              margin: "1rem 0 0.75rem",
            }}
          >
            No estimaciones.
          </h2>
          <p style={{ fontSize: "0.9rem", color: T.inkMd, lineHeight: 1.75, marginBottom: "2rem" }}>
            Cada campaña incluye un reporte semanal con datos verificables de tu inversión.
          </p>
          <ReportList showDesc />
        </div>
      </section>

      {/* -- FINAL CTA ---------------------------------------------------------- */}
      <section
        aria-label="Llamado a la acción"
        style={{
          background: `linear-gradient(135deg, ${T.cobalt} 0%, #0A2FA0 100%)`,
          padding: "4rem 1.25rem",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            ¿Listo para<br />activar tu campaña?
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.65)", marginBottom: "2rem", lineHeight: 1.7 }}>
            Nuestro equipo te contacta en menos de 24 horas.
          </p>
          <p style={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "rgba(150,180,255,1)",
            lineHeight: 1.6,
            marginTop: "-1.25rem",
            marginBottom: "0.75rem",
          }}>
            Espacios limitados para marcas fundadoras.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href={ROUTES.marcas}
              scroll={false}
              className="btn"
              style={{
                background: "#fff",
                color: T.cobalt,
                padding: "0.9rem 1.6rem",
                fontSize: "0.78rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                borderRadius: 8,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.ivory; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
            >
              Anunciar mi marca
            </Link>
            <Link
              href={ROUTES.conductores}
              scroll={false}
              className="btn"
              style={{
                background: "transparent",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.35)",
                padding: "0.9rem 1.6rem",
                fontSize: "0.78rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                borderRadius: 8,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
            >
              Conducir con Escanea
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
