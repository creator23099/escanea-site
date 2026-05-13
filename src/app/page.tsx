"use client";
import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { T, FL } from "@/lib/tokens";
import type {
  AccordionItem,
  BrandsFormData,
  DriversFormData,
  NavItem,
  Page,
  SetPage,
} from "@/lib/types";
import { useInView } from "@/lib/use-in-view";
import { validateBrandsStep, validateDriversStep } from "@/lib/validation";
import { Accordion } from "@/components/primitives/Accordion";
import { Chips } from "@/components/primitives/Chips";
import { DarkTag } from "@/components/primitives/DarkTag";
import { LiveDot } from "@/components/primitives/LiveDot";
import { ReportList } from "@/components/primitives/ReportList";
import { StepBar } from "@/components/primitives/StepBar";
import { SuccessCard } from "@/components/primitives/SuccessCard";
import { Tag } from "@/components/primitives/Tag";

/* --- Navbar ------------------------------------------------------------------- */
const NAV_ITEMS: NavItem[] = [
  { l: "Inicio",       p: "home" },
  { l: "Marcas",      p: "brands" },
  { l: "Conductores", p: "drivers" },
  { l: "Por Qué Ahora", p: "why" },
];

interface NavbarProps {
  page: Page;
  setPage: SetPage;
  scrolled: boolean;
}

/** Returns all focusable elements inside `root`, in DOM order. */
function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea'
    )
  );
}

function Navbar({ page, setPage, scrolled }: NavbarProps) {
  const [mobOpen, setMobOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef(false);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.classList.toggle("nav-open", mobOpen);
    return () => document.body.classList.remove("nav-open");
  }, [mobOpen]);

  const navigate = useCallback(
    (p: Page) => {
      setPage(p);
      setMobOpen(false);
    },
    [setPage]
  );

  // Keyboard: Escape closes, Tab/Shift+Tab cycles focus inside the dialog
  useEffect(() => {
    if (!mobOpen) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = getFocusable(dialogRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobOpen]);

  // Focus management: focus first item on open, restore to hamburger on close
  useEffect(() => {
    if (mobOpen) {
      const focusable = getFocusable(dialogRef.current);
      focusable[0]?.focus();
    } else if (prevOpenRef.current) {
      hamburgerRef.current?.focus();
    }
    prevOpenRef.current = mobOpen;
  }, [mobOpen]);

  return (
    <>
      <nav
        aria-label="Navegación principal"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 300,
          height: 60,
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(247,245,241,0.95)" : T.ivory,
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none", // Safari support
          borderBottom: `1.5px solid ${scrolled ? T.stone : "transparent"}`,
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("home")}
          aria-label="Escanea — ir al inicio"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'DM Serif Display',serif",
            fontSize: "1.15rem",
            color: T.ink,
            letterSpacing: "0.02em",
            padding: "0.25rem 0",
          }}
        >
          Escanea
        </button>

        {/* Desktop nav */}
        <div className="hide-mobile" style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
          {NAV_ITEMS.map((x) => (
            <button
              key={x.p}
              type="button"
              className={`nav-link ${page === x.p ? "active" : ""}`}
              onClick={() => setPage(x.p)}
              aria-current={page === x.p ? "page" : undefined}
            >
              {x.l}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: "0.55rem 1.1rem" }}
            onClick={() => setPage("brands")}
          >
            Anunciar
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          type="button"
          onClick={() => setMobOpen((v) => !v)}
          aria-expanded={mobOpen}
          aria-controls="mobile-menu"
          aria-label={mobOpen ? "Cerrar menú" : "Abrir menú"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "none", // shown via media query class below
            flexDirection: "column",
            gap: 5,
            padding: "8px 4px",
          }}
          id="mob-btn"
        >
          {[0, 1, 2].map((i) => (
            <div key={i} aria-hidden="true" style={{ width: 22, height: 2, background: T.ink, borderRadius: 2 }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobOpen && (
        <div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          style={{
            position: "fixed",
            top: 60,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 299,
            background: T.ivory,
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            animation: "slideDown 0.25s ease",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {NAV_ITEMS.map((x) => (
            <button
              key={x.p}
              type="button"
              onClick={() => navigate(x.p)}
              aria-current={page === x.p ? "page" : undefined}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "1.1rem",
                fontWeight: page === x.p ? 700 : 400,
                color: page === x.p ? T.cobalt : T.ink,
              }}
            >
              {x.l}
            </button>
          ))}
          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={() => navigate("brands")}
            >
              Anunciar mi marca
            </button>
            <button
              type="button"
              className="btn btn-outline btn-full"
              onClick={() => navigate("drivers")}
            >
              Conducir con Escanea
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* --- Footer ------------------------------------------------------------------- */
function Footer({ setPage }: { setPage: SetPage }) {
  return (
    <footer style={{ background: T.navy, padding: "3rem 1.25rem 2rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "1.3rem",
                color: "#fff",
                marginBottom: "0.4rem",
              }}
            >
              Escanea
            </div>
            <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
              Transformando el tráfico<br />en atención medible.
            </div>
          </div>
          <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
            <nav aria-label="Enlaces del sitio">
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "0.9rem",
                }}
              >
                Plataforma
              </div>
              {NAV_ITEMS.map(({ l, p }) => (
                <button
                  key={p}
                  type="button"
                  className="footer-link"
                  onClick={() => setPage(p)}
                >
                  {l}
                </button>
              ))}
            </nav>
            <address style={{ fontStyle: "normal" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "0.9rem",
                }}
              >
                Contacto
              </div>
              <a
                href="mailto:contacto@escanea.co"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "rgba(255,255,255,0.55)",
                  textDecoration: "none",
                  marginBottom: "0.6rem",
                }}
              >
                contacto@escanea.co
              </a>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>www.escanea.co</div>
            </address>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>© 2025 Escanea. Colombia.</div>
          <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.25)" }}>Media urbana en movimiento.</div>
        </div>
      </div>
    </footer>
  );
}

/* ===============================================================================
   HOME PAGE
=============================================================================== */
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
    t: "Instalación en flota activa",
    d: "Diseños profesionales instalados en vehículos que circulan por zonas estratégicas de la ciudad.",
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

const COMPARISON_ROWS = [
  {
    bad: {
      label: "Publicidad estática",
      text: "Un punto fijo. Todo el día, mismo lugar. Espera a que tu audiencia pase — una sola vez.",
    },
    good: {
      label: "Escanea",
      text: "Tu campaña recorre la ciudad. Zonas residenciales, comerciales y corporativas en una sola campaña.",
    },
  },
  {
    bad: {
      label: "Publicidad digital",
      text: "Ignorada por saturación. Bloqueada por hábito. El usuario promedio ignora la mayoría de anuncios que ve.",
    },
    good: {
      label: "Escanea",
      text: "Atención física real. Exposición repetida en múltiples zonas. Interacción QR medible y verificable.",
    },
  },
];

function HomePage({ setPage }: { setPage: SetPage }) {
  const [r1, v1] = useInView<HTMLElement>();
  const [r2, v2] = useInView<HTMLElement>();
  const [r3, v3] = useInView<HTMLElement>();
  const [r4, v4] = useInView<HTMLElement>();
  const [r5, v5] = useInView<HTMLElement>();

  return (
    <div style={{ background: T.ivory }}>
      {/* -- HERO --------------------------------------------------------------- */}
      <section
        aria-label="Bienvenida"
        style={{
          minHeight: "calc(100svh - 60px)", // svh for mobile browser chrome
          paddingTop: 60,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: `linear-gradient(160deg, ${T.white} 0%, ${T.ivory} 60%, ${T.ivoryDk} 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs — aria-hidden */}
        <div aria-hidden="true" style={{
          position: "absolute", top: "-10%", right: "-15%",
          width: "55vw", height: "55vw", maxWidth: 550, maxHeight: 550,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,79,214,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", bottom: "5%", left: "-5%",
          width: "30vw", height: "30vw", maxWidth: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(26,79,214,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.25rem", position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: "1.5rem", animation: "fadeIn 0.6s ease 0.1s both" }}>
            <Tag><LiveDot /> Media urbana en movimiento</Tag>
          </div>

          <h1
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(2.4rem, 7vw, 4.2rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: T.ink,
              marginBottom: "1.1rem",
              animation: "fadeUp 0.7s ease 0.25s both",
            }}
          >
            ¿Y si el tráfico<br />
            <em style={{ color: T.cobalt, fontStyle: "italic" }}>sí funcionara?</em>
          </h1>

          <p style={{
            fontSize: "1.05rem",
            fontWeight: 400,
            color: T.inkMd,
            lineHeight: 1.7,
            maxWidth: 480,
            marginBottom: "2.2rem",
            animation: "fadeUp 0.7s ease 0.38s both",
          }}>
            Transformando el tráfico en atención medible. Publicidad en movimiento con reportes reales.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", animation: "fadeUp 0.7s ease 0.5s both" }}>
            <button className="btn btn-primary" onClick={() => setPage("brands")}>
              Anunciar mi marca
            </button>
            <button className="btn btn-outline" onClick={() => setPage("drivers")}>
              Conducir con Escanea
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", marginTop: "2.5rem", animation: "fadeUp 0.7s ease 0.62s both" }}>
            {["Reportes semanales", "QR medible", "Sin contratos largos"].map((t) => (
              <div
                key={t}
                style={{
                  padding: "0.35rem 0.85rem",
                  background: T.white,
                  border: `1px solid ${T.stone}`,
                  borderRadius: 20,
                  fontSize: "0.75rem",
                  color: T.inkMd,
                  fontWeight: 500,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- CÓMO FUNCIONA ------------------------------------------------------ */}
      <section ref={r1} style={{ background: T.navy, padding: "4rem 1.25rem" }} aria-label="Cómo funciona">
        <div className={`fade-up ${v1 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>Por qué Escanea</Tag>
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

      {/* -- COMPARISON --------------------------------------------------------- */}
      <section ref={r2} style={{ background: T.ivory, padding: "4rem 1.25rem" }} aria-label="Comparación">
        <div className={`fade-up ${v2 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>La diferencia</Tag>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.7rem, 4.5vw, 2.6rem)",
              color: T.ink,
              lineHeight: 1.15,
              margin: "1rem 0 2rem",
            }}
          >
            No toda publicidad<br />funciona igual.
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {COMPARISON_ROWS.map((row, i) => (
              <div key={i} className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className="cmp-bad">
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.inkLt, marginBottom: "0.6rem" }}>
                    {row.bad.label}
                  </div>
                  <p style={{ fontSize: "0.87rem", color: T.inkMd, lineHeight: 1.7 }}>{row.bad.text}</p>
                </div>
                <div className="cmp-good">
                  <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(150,185,255,0.8)", marginBottom: "0.6rem" }}>
                    {row.good.label}
                  </div>
                  <p style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>{row.good.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- WHY IT WORKS ------------------------------------------------------- */}
      <section ref={r3} style={{ background: T.white, padding: "4rem 1.25rem" }}>
        <div className={`fade-up ${v3 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
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
      <section ref={r4} style={{ background: T.ivory, padding: "4rem 1.25rem" }}>
        <div className={`fade-up ${v4 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { label: "Para Marcas",      h: "Transforma tráfico urbano en atención medible.", cta: "Anunciar mi marca",    action: () => setPage("brands"),  accent: true  },
              { label: "Para Conductores", h: "Genera ingresos sin cambiar tus rutas.",          cta: "Conducir con Escanea", action: () => setPage("drivers"), accent: false },
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
                <button
                  className={`btn ${c.accent ? "btn-outline" : "btn-primary"}`}
                  style={
                    c.accent
                      ? { border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", fontSize: "0.72rem", padding: "0.75rem 1rem" }
                      : { fontSize: "0.72rem", padding: "0.75rem 1rem" }
                  }
                  onClick={c.action}
                >
                  {c.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- REPORTING ---------------------------------------------------------- */}
      <section ref={r5} style={{ background: T.white, padding: "4rem 1.25rem" }}>
        <div className={`fade-up ${v5 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
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
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
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
              onClick={() => setPage("brands")}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.ivory; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
            >
              Anunciar mi marca
            </button>
            <button
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
              onClick={() => setPage("drivers")}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; }}
            >
              Conducir con Escanea
            </button>
          </div>
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
}

/* ===============================================================================
   BRANDS PAGE
=============================================================================== */
const BRANDS_FAQ: AccordionItem[] = [
  {
    q: "Visibilidad urbana",
    a: "Tu marca circula donde realmente está la gente: vías principales, zonas residenciales, corredores comerciales y sectores corporativos.",
  },
  {
    q: "Exposición repetida",
    a: "La repetición física genera recordación. Tus campañas aparecen múltiples veces durante la rutina diaria de la audiencia.",
  },
  {
    q: "Reportes medibles",
    a: "Todas las campañas incluyen seguimiento QR y reportes semanales verificables. Datos reales de tu inversión.",
  },
  {
    q: "Activación de campaña",
    a: "Seleccionamos rutas, zonas y vehículos según los objetivos y ubicación de tu campaña.",
  },
];

const BRANDS_STEP_LABELS = ["Ciudad", "Zonas", "Presupuesto", "Objetivo", "Problema", "Contacto", "Notas"];

const INITIAL_BRANDS: BrandsFormData = {
  ciudad: "", zonas: "", presupuesto: "", objetivo: [],
  problema: [], empresa: "", whatsapp: "", email: "", notas: "",
};

function BrandsPage({ setPage }: { setPage: SetPage }) {
  const [r1, v1] = useInView<HTMLElement>();
  const [r2, v2] = useInView<HTMLElement>();
  const [r3, v3] = useInView<HTMLElement>();
  const [step, setStep] = useState(0);
  const [fd, setFd] = useState<BrandsFormData>(INITIAL_BRANDS);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const TOTAL = BRANDS_STEP_LABELS.length;

  const upd = useCallback(
    (k: keyof BrandsFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFd((f) => ({ ...f, [k]: e.target.value }));
        setError(null);
      },
    []
  );

  const next = () => {
    const err = validateBrandsStep(step, fd);
    if (err) { setError(err); return; }
    setError(null);
    setStep((s) => s + 1);
  };

  const prev = () => { setError(null); setStep((s) => s - 1); };

  const submit = () => {
    const err = validateBrandsStep(step, fd);
    if (err) { setError(err); return; }
    setSent(true);
  };

  const stepContent: ReactNode[] = [
    <div key={0}>
      <label htmlFor="b-ciudad" style={FL}>Ciudad</label>
      <select id="b-ciudad" className={`fi ${error ? "error" : ""}`} value={fd.ciudad} onChange={upd("ciudad")} required aria-required="true">
        <option value="">Selecciona tu ciudad</option>
        <option>Bogotá</option>
        <option>Medellín</option>
      </select>
    </div>,
    <div key={1}>
      <label htmlFor="b-zonas" style={FL}>Barrios o zonas de interés</label>
      <textarea id="b-zonas" className={`fi ${error ? "error" : ""}`} rows={3} value={fd.zonas} onChange={upd("zonas")} placeholder="Ej: Chapinero, Zona Rosa, Usaquén..." />
    </div>,
    <div key={2}>
      <label htmlFor="b-presupuesto" style={FL}>Presupuesto mensual aproximado</label>
      <select id="b-presupuesto" className="fi" value={fd.presupuesto} onChange={upd("presupuesto")}>
        <option value="">Seleccionar</option>
        <option>Menos de $2M COP</option>
        <option>$2M – $5M COP</option>
        <option>$5M – $10M COP</option>
        <option>Más de $10M COP</option>
      </select>
    </div>,
    <div key={3}>
      <label style={FL}>Objetivo principal</label>
      <Chips
        multi
        label="Objetivo principal"
        options={["Reconocimiento de marca", "Visibilidad local", "Adquisición de clientes", "Tráfico a WhatsApp", "Tráfico QR", "Awareness urbano"]}
        value={fd.objetivo}
        onChange={(v) => setFd((f) => ({ ...f, objetivo: v as string[] }))}
      />
    </div>,
    <div key={4}>
      <label style={FL}>Principal problema de marketing</label>
      <Chips
        multi
        label="Principal problema de marketing"
        options={["Baja visibilidad", "Anuncios digitales costosos", "Poco engagement", "Baja recordación", "Competencia alta"]}
        value={fd.problema}
        onChange={(v) => setFd((f) => ({ ...f, problema: v as string[] }))}
      />
    </div>,
    <div key={5} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div>
        <label htmlFor="b-empresa" style={FL}>Nombre de la empresa</label>
        <input id="b-empresa" className={`fi ${error && !fd.empresa ? "error" : ""}`} type="text" value={fd.empresa} onChange={upd("empresa")} placeholder="Tu empresa o marca" required aria-required="true" />
      </div>
      <div>
        <label htmlFor="b-whatsapp" style={FL}>WhatsApp</label>
        <input id="b-whatsapp" className={`fi ${error && !fd.whatsapp ? "error" : ""}`} type="tel" value={fd.whatsapp} onChange={upd("whatsapp")} placeholder="+57 300 000 0000" required aria-required="true" />
      </div>
      <div>
        <label htmlFor="b-email" style={FL}>Email</label>
        <input id="b-email" className={`fi ${error && !fd.email ? "error" : ""}`} type="email" value={fd.email} onChange={upd("email")} placeholder="tu@empresa.co" required aria-required="true" />
      </div>
    </div>,
    <div key={6}>
      <label htmlFor="b-notas" style={FL}>Objetivos adicionales o información importante</label>
      <textarea id="b-notas" className="fi" rows={4} value={fd.notas} onChange={upd("notas")} placeholder="Cuéntanos más sobre tu marca, objetivos o zonas de interés." />
    </div>,
  ];

  return (
    <div style={{ background: T.ivory }}>
      <section
        aria-label="Campaña para marcas"
        style={{
          background: `linear-gradient(160deg, ${T.white} 0%, ${T.ivory} 100%)`,
          padding: "100px 1.25rem 3rem",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ animation: "fadeIn 0.6s ease 0.1s both", marginBottom: "1.2rem" }}>
            <Tag>Para Marcas</Tag>
          </div>
          <h1
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
              lineHeight: 1.1,
              color: T.ink,
              marginBottom: "1rem",
              animation: "fadeUp 0.7s ease 0.25s both",
            }}
          >
            Tu campaña<br />
            <em style={{ color: T.cobalt }}>recorre la ciudad.</em>
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: T.inkMd,
              lineHeight: 1.75,
              maxWidth: 480,
              marginBottom: "2rem",
              animation: "fadeUp 0.7s ease 0.38s both",
            }}
          >
            Publicidad exterior en movimiento. Medible, verificable y presente donde está tu audiencia — todos los días.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("brands-form")?.scrollIntoView({ behavior: "smooth" })}
          >
            Activar campaña →
          </button>
        </div>
      </section>

      <section ref={r1} style={{ background: T.ivory, padding: "3.5rem 1.25rem" }}>
        <div className={`fade-up ${v1 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>La plataforma</Tag>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: T.ink,
              lineHeight: 1.2,
              margin: "1rem 0 1.75rem",
            }}
          >
            ¿Por qué Escanea?
          </h2>
          <Accordion items={BRANDS_FAQ} />
        </div>
      </section>

      <section ref={r2} style={{ background: T.white, padding: "3.5rem 1.25rem" }}>
        <div className={`fade-up ${v2 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>Reportes reales. No estimaciones.</Tag>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: T.ink,
              lineHeight: 1.2,
              margin: "1rem 0 1.5rem",
            }}
          >
            Lo que recibes cada semana.
          </h2>
          <ReportList />
        </div>
      </section>

      {/* Multi-step form */}
      <section ref={r3} id="brands-form" style={{ background: T.ivory, padding: "3.5rem 1.25rem" }}>
        <div className={`fade-up ${v3 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>Formulario</Tag>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: T.ink,
              lineHeight: 1.2,
              margin: "1rem 0 2rem",
            }}
          >
            Activa tu campaña
          </h2>

          {sent ? (
            <SuccessCard
              title="¡Solicitud recibida!"
              message="Nuestro equipo te contacta en menos de 24 horas."
              bg={T.white}
            />
          ) : (
            <div
              style={{ background: T.white, border: `1.5px solid ${T.stone}`, borderRadius: 16, padding: "1.75rem" }}
              role="form"
              aria-label="Formulario de campaña para marcas"
            >
              <StepBar current={step} total={TOTAL} />
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkLt, marginBottom: "1rem" }}>
                Paso {step + 1}: {BRANDS_STEP_LABELS[step]}
              </div>
              <div style={{ minHeight: 120, marginBottom: "1rem" }}>{stepContent[step]}</div>
              {error && <p className="field-error" role="alert">{error}</p>}
              <div style={{ display: "flex", gap: "0.65rem", justifyContent: "space-between", marginTop: "1rem" }}>
                {step > 0 && (
                  <button className="btn btn-outline" onClick={prev} style={{ fontSize: "0.78rem" }}>
                    ← Anterior
                  </button>
                )}
                <div style={{ marginLeft: "auto" }}>
                  {step < TOTAL - 1 ? (
                    <button className="btn btn-primary" onClick={next} style={{ fontSize: "0.78rem" }}>
                      Siguiente →
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={submit} style={{ fontSize: "0.78rem" }}>
                      Enviar solicitud →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
}

/* ===============================================================================
   DRIVERS PAGE
=============================================================================== */
const DRIVERS_FAQ: AccordionItem[] = [
  {
    q: "Ingresos adicionales",
    a: "Genera un ingreso mensual adicional mientras haces lo que ya haces todos los días: moverte por la ciudad.",
  },
  {
    q: "Participación flexible",
    a: "Tú decides cuándo participar. Sin horarios obligatorios ni rutas específicas que debas seguir.",
  },
  {
    q: "Instalación removible",
    a: "Sin modificaciones permanentes al vehículo. Instalación y retiro profesional incluidos sin costo adicional.",
  },
  {
    q: "Rutas normales",
    a: "El modelo funciona sobre tus recorridos habituales — no necesitas cambiar tu rutina diaria para participar.",
  },
];

const DRIVERS_STEP_LABELS = ["Ciudad", "Zonas", "Kilómetros", "Vehículo", "Premium", "Contacto", "Notas"];

const INITIAL_DRIVERS: DriversFormData = {
  ciudad: "", zonas: "", km: "", vehiculo: "", premium: false,
  nombre: "", whatsapp: "", email: "", notas: "",
};

function DriversPage({ setPage }: { setPage: SetPage }) {
  const [r1, v1] = useInView<HTMLElement>();
  const [r2, v2] = useInView<HTMLElement>();
  const [step, setStep] = useState(0);
  const [fd, setFd] = useState<DriversFormData>(INITIAL_DRIVERS);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const TOTAL = DRIVERS_STEP_LABELS.length;

  const upd = useCallback(
    (k: keyof DriversFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFd((f) => ({ ...f, [k]: e.target.value }));
        setError(null);
      },
    []
  );

  const next = () => {
    const err = validateDriversStep(step, fd);
    if (err) { setError(err); return; }
    setError(null);
    setStep((s) => s + 1);
  };

  const prev = () => { setError(null); setStep((s) => s - 1); };

  const submit = () => {
    const err = validateDriversStep(step, fd);
    if (err) { setError(err); return; }
    setSent(true);
  };

  const stepContent: ReactNode[] = [
    <div key={0}>
      <label htmlFor="d-ciudad" style={FL}>Ciudad</label>
      <select id="d-ciudad" className={`fi ${error ? "error" : ""}`} value={fd.ciudad} onChange={upd("ciudad")} required aria-required="true">
        <option value="">Selecciona tu ciudad</option>
        <option>Bogotá</option>
        <option>Medellín</option>
      </select>
    </div>,
    <div key={1}>
      <label htmlFor="d-zonas" style={FL}>Barrios o zonas donde más conduces</label>
      <textarea id="d-zonas" className={`fi ${error ? "error" : ""}`} rows={3} value={fd.zonas} onChange={upd("zonas")} placeholder="Ej: Kennedy, Bello, El Poblado..." />
    </div>,
    <div key={2}>
      <label htmlFor="d-km" style={FL}>Kilómetros aproximados por mes</label>
      <select id="d-km" className="fi" value={fd.km} onChange={upd("km")}>
        <option value="">Seleccionar</option>
        <option>Menos de 1.000 km</option>
        <option>1.000 – 2.500 km</option>
        <option>2.500 – 5.000 km</option>
        <option>Más de 5.000 km</option>
      </select>
    </div>,
    <div key={3}>
      <label htmlFor="d-vehiculo" style={FL}>Vehículo (marca / modelo / año)</label>
      <input id="d-vehiculo" className={`fi ${error ? "error" : ""}`} type="text" value={fd.vehiculo} onChange={upd("vehiculo")} placeholder="Ej: Chevrolet Spark 2020" />
    </div>,
    <div key={4}>
      <button
        type="button"
        role="checkbox"
        aria-checked={fd.premium}
        onClick={() => setFd((f) => ({ ...f, premium: !f.premium }))}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "0.85rem",
          background: T.ivoryDk,
          border: `1.5px solid ${fd.premium ? T.cobalt : T.stone}`,
          borderRadius: 12,
          padding: "1.25rem",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
          transition: "border-color 0.18s",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            flexShrink: 0,
            border: `2px solid ${fd.premium ? T.cobalt : T.stoneMd}`,
            background: fd.premium ? T.cobalt : T.white,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.18s",
            marginTop: 2,
          }}
        >
          {fd.premium && (
            <div style={{ width: 10, height: 7, borderLeft: "2px solid #fff", borderBottom: "2px solid #fff", transform: "rotate(-45deg) translate(1px,-1px)" }} />
          )}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9rem", color: T.ink }}>Campañas premium con vinilo trasero</div>
          <div style={{ fontSize: "0.82rem", color: T.inkMd, marginTop: "0.25rem", lineHeight: 1.6 }}>
            Estoy interesado en participar en campañas con instalación de vinilo en la parte trasera del vehículo.
          </div>
        </div>
      </button>
    </div>,
    <div key={5} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div>
        <label htmlFor="d-nombre" style={FL}>Nombre completo</label>
        <input id="d-nombre" className={`fi ${error && !fd.nombre ? "error" : ""}`} type="text" value={fd.nombre} onChange={upd("nombre")} placeholder="Tu nombre" required aria-required="true" />
      </div>
      <div>
        <label htmlFor="d-whatsapp" style={FL}>WhatsApp</label>
        <input id="d-whatsapp" className={`fi ${error && !fd.whatsapp ? "error" : ""}`} type="tel" value={fd.whatsapp} onChange={upd("whatsapp")} placeholder="+57 300 000 0000" required aria-required="true" />
      </div>
      <div>
        <label htmlFor="d-email" style={FL}>Email</label>
        <input id="d-email" className={`fi ${error && !fd.email ? "error" : ""}`} type="email" value={fd.email} onChange={upd("email")} placeholder="tu@correo.com" required aria-required="true" />
      </div>
    </div>,
    <div key={6}>
      <label htmlFor="d-notas" style={FL}>Información adicional</label>
      <textarea id="d-notas" className="fi" rows={4} value={fd.notas} onChange={upd("notas")} placeholder="Cuéntanos sobre tus rutas, horarios o cualquier detalle importante." />
    </div>,
  ];

  return (
    <div style={{ background: T.ivory }}>
      <section
        aria-label="Programa para conductores"
        style={{
          background: `linear-gradient(160deg, ${T.navy} 0%, ${T.navyMd} 100%)`,
          padding: "100px 1.25rem 3.5rem",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ animation: "fadeIn 0.6s ease 0.1s both", marginBottom: "1.2rem" }}>
            <DarkTag>Para Conductores</DarkTag>
          </div>
          <h1
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
              lineHeight: 1.1,
              color: "#fff",
              marginBottom: "1rem",
              animation: "fadeUp 0.7s ease 0.25s both",
            }}
          >
            Tu vehículo ya<br />
            <em style={{ color: "rgba(150,185,255,0.85)" }}>trabaja para ti.</em>
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.75,
              maxWidth: 460,
              marginBottom: "2rem",
              animation: "fadeUp 0.7s ease 0.38s both",
            }}
          >
            Genera ingresos adicionales mientras conduces. Sin cambiar tus rutas, sin compromisos rígidos.
          </p>
          <button
            className="btn"
            style={{
              background: "#fff",
              color: T.navy,
              border: "none",
              borderRadius: 8,
              padding: "0.9rem 1.6rem",
              fontSize: "0.78rem",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              animation: "fadeUp 0.7s ease 0.5s both",
            }}
            onClick={() => document.getElementById("drivers-form")?.scrollIntoView({ behavior: "smooth" })}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.ivory; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
          >
            Unirme a la red →
          </button>

          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", marginTop: "2.5rem", animation: "fadeUp 0.7s ease 0.62s both" }}>
            {["Sin modificaciones permanentes", "Ingresos mensuales", "Proceso simple"].map((t) => (
              <div
                key={t}
                style={{
                  padding: "0.35rem 0.85rem",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 20,
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 500,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={r1} style={{ background: T.ivory, padding: "3.5rem 1.25rem" }}>
        <div className={`fade-up ${v1 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>Cómo funciona</Tag>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: T.ink,
              lineHeight: 1.2,
              margin: "1rem 0 1.75rem",
            }}
          >
            Beneficios del programa
          </h2>
          <Accordion items={DRIVERS_FAQ} />
        </div>
      </section>

      <section ref={r2} id="drivers-form" style={{ background: T.white, padding: "3.5rem 1.25rem" }}>
        <div className={`fade-up ${v2 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>Registro</Tag>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: T.ink,
              lineHeight: 1.2,
              margin: "1rem 0 2rem",
            }}
          >
            Únete a la red
          </h2>

          {sent ? (
            <SuccessCard title="¡Registro recibido!" message="Nuestro equipo te contacta en las próximas 48 horas." />
          ) : (
            <div
              style={{ background: T.ivoryDk, border: `1.5px solid ${T.stone}`, borderRadius: 16, padding: "1.75rem" }}
              role="form"
              aria-label="Formulario de registro para conductores"
            >
              <StepBar current={step} total={TOTAL} />
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkLt, marginBottom: "1rem" }}>
                Paso {step + 1}: {DRIVERS_STEP_LABELS[step]}
              </div>
              <div style={{ minHeight: 120, marginBottom: "1rem" }}>{stepContent[step]}</div>
              {error && <p className="field-error" role="alert">{error}</p>}
              <div style={{ display: "flex", gap: "0.65rem", justifyContent: "space-between", marginTop: "1rem" }}>
                {step > 0 && (
                  <button className="btn btn-outline" onClick={prev} style={{ fontSize: "0.78rem" }}>← Anterior</button>
                )}
                <div style={{ marginLeft: "auto" }}>
                  {step < TOTAL - 1 ? (
                    <button className="btn btn-navy" onClick={next} style={{ fontSize: "0.78rem" }}>Siguiente →</button>
                  ) : (
                    <button className="btn btn-navy" onClick={submit} style={{ fontSize: "0.78rem" }}>Enviar registro →</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
}

/* ===============================================================================
   WHY NOW PAGE
=============================================================================== */
const WHY_ITEMS: AccordionItem[] = [
  {
    q: "Movimiento urbano desaprovechado",
    a: "Millones de kilómetros urbanos se recorren todos los días sin generar valor publicitario medible. Escanea activa esa infraestructura silenciosa.",
  },
  {
    q: "Fatiga digital",
    a: "La atención digital está saturada. Los usuarios ignoran anuncios constantemente. La publicidad física en movimiento genera atención natural sin resistencia.",
  },
  {
    q: "Costo de vida",
    a: "Cada vez más conductores buscan ingresos complementarios sin depender de más horas laborales. Escanea convierte el movimiento cotidiano en valor económico.",
  },
  {
    q: "Publicidad física medible",
    a: "La publicidad offline ya no debe operar sin datos. Escanea conecta exposición física con métricas reales: zonas, kilómetros, escaneos y conversaciones.",
  },
  {
    q: "Exposición repetida",
    a: "La repetición en movimiento crea familiaridad de marca en contextos reales de ciudad. No una sola impresión — presencia diaria y constante.",
  },
];

const MISSION_POINTS = [
  ["Red urbana activa",     "Vehículos que circulan diariamente generando exposición real en múltiples zonas."],
  ["Atribución QR",         "Cada instalación incluye seguimiento QR único para medir interacciones reales."],
  ["Reportes verificables", "Datos reales de campaña: no estimaciones, no proyecciones."],
] as const;

function WhyPage({ setPage }: { setPage: SetPage }) {
  const [r1, v1] = useInView<HTMLElement>();
  const [r2, v2] = useInView<HTMLElement>();

  return (
    <div style={{ background: T.ivory }}>
      <section
        aria-label="Por qué ahora"
        style={{
          background: `linear-gradient(160deg, ${T.white} 0%, ${T.ivory} 100%)`,
          padding: "100px 1.25rem 3.5rem",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ animation: "fadeIn 0.6s ease 0.1s both", marginBottom: "1.2rem" }}>
            <Tag>Por Qué Ahora</Tag>
          </div>
          <h1
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(2.2rem, 6vw, 3.8rem)",
              lineHeight: 1.1,
              color: T.ink,
              marginBottom: "1rem",
              animation: "fadeUp 0.7s ease 0.25s both",
            }}
          >
            El futuro de la<br />
            <em style={{ color: T.cobalt }}>publicidad urbana.</em>
          </h1>
          <p
            style={{
              fontSize: "1rem",
              color: T.inkMd,
              lineHeight: 1.75,
              maxWidth: 480,
              animation: "fadeUp 0.7s ease 0.38s both",
            }}
          >
            Una respuesta inteligente a la fatiga digital, el costo de vida urbano y la demanda de publicidad
            física con datos reales.
          </p>
        </div>
      </section>

      <section ref={r1} style={{ background: T.white, padding: "3.5rem 1.25rem" }}>
        <div className={`fade-up ${v1 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>El contexto</Tag>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: T.ink,
              lineHeight: 1.2,
              margin: "1rem 0 1.75rem",
            }}
          >
            Cinco razones que hacen esto urgente.
          </h2>
          <Accordion items={WHY_ITEMS} />
        </div>
      </section>

      {/* Mission — navy section */}
      <section style={{ background: T.navy, padding: "4rem 1.25rem" }} aria-label="La misión">
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ marginBottom: "1.2rem" }}>
            <DarkTag>La misión</DarkTag>
          </div>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.7rem, 4.5vw, 2.8rem)",
              color: "#fff",
              lineHeight: 1.2,
              marginBottom: "1.25rem",
            }}
          >
            Convertir la ciudad en<br />
            <em style={{ color: "rgba(150,185,255,0.85)" }}>infraestructura publicitaria.</em>
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, maxWidth: 520, marginBottom: "2.5rem" }}>
            Escanea no es una agencia de publicidad. Es una red de media urbana medible — construida sobre el
            movimiento real de la ciudad, operada con tecnología y orientada a resultados verificables.
          </p>
          <ol style={{ listStyle: "none" }}>
            {MISSION_POINTS.map(([t, d], i) => (
              <li
                key={t}
                style={{
                  padding: "1.4rem 0",
                  borderBottom: i < MISSION_POINTS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  display: "flex",
                  gap: "1.25rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(26,79,214,0.4)",
                    border: "1px solid rgba(61,142,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", color: "rgba(150,185,255,0.9)", fontWeight: 700,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "#fff", fontSize: "0.92rem", marginBottom: "0.3rem" }}>{t}</div>
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section ref={r2} style={{ background: T.ivory, padding: "4rem 1.25rem" }}>
        <div className={`fade-up ${v2 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.7rem, 4.5vw, 2.6rem)",
              color: T.ink,
              lineHeight: 1.2,
              marginBottom: "1rem",
            }}
          >
            ¿Quieres ser parte?
          </h2>
          <p style={{ fontSize: "0.95rem", color: T.inkMd, lineHeight: 1.75, marginBottom: "2rem" }}>
            Únete a la red como marca o como conductor. Escanea está construyendo la próxima capa de media
            urbana en Colombia.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => setPage("brands")}>Anunciar mi marca</button>
            <button className="btn btn-outline" onClick={() => setPage("drivers")}>Conducir con Escanea</button>
          </div>
        </div>
      </section>

      <Footer setPage={setPage} />
    </div>
  );
}

/* ===============================================================================
   ROOT
=============================================================================== */
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [scrolled, setScrolled] = useState(false);

  // Throttled scroll handler
  useEffect(() => {
    let ticking = false;
    const h = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const changePage = useCallback<SetPage>((p) => {
    setPage(p);
    // Positional scrollTo(x, y) is always instant — bypasses html { scroll-behavior: smooth; }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar page={page} setPage={changePage} scrolled={scrolled} />
      <main id="main-content">
        {page === "home"    && <HomePage    setPage={changePage} />}
        {page === "brands"  && <BrandsPage  setPage={changePage} />}
        {page === "drivers" && <DriversPage setPage={changePage} />}
        {page === "why"     && <WhyPage     setPage={changePage} />}
      </main>
    </>
  );
}