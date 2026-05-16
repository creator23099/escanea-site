"use client";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  CSSProperties,
  RefObject,
  KeyboardEvent,
} from "react";

/* --- Design Tokens ----------------------------------------------------------- */
const T = {
  ivory:    "#F7F5F1",
  ivoryDk:  "#EFEDE8",
  stone:    "#E2DED8",
  stoneMd:  "#C8C2B8",
  cobalt:   "#1A4FD6",
  cobaltLt: "#2D6BFF",
  cobaltBg: "rgba(26,79,214,0.07)",
  navy:     "#0D1B2A",
  navyMd:   "#1C2E42",
  navyLt:   "#374B62",
  ink:      "#1A2332",
  inkMd:    "#3D4E62",
  inkLt:    "#6B7A8D",
  white:    "#FFFFFF",
} as const;

/* --- Global CSS --------------------------------------------------------------- */
const GLOBAL = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { font-size:16px; scroll-behavior:smooth; }
  body { background:${T.ivory}; font-family:'DM Sans',sans-serif; color:${T.ink}; -webkit-font-smoothing:antialiased; }
  body.nav-open { overflow:hidden; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.55} }

  .fade-up         { opacity:0; transform:translateY(24px); transition:opacity 0.7s cubic-bezier(.22,.8,.36,1), transform 0.7s cubic-bezier(.22,.8,.36,1); }
  .fade-up.visible { opacity:1; transform:translateY(0); }
  .fade-up.d1 { transition-delay:0.1s; }
  .fade-up.d2 { transition-delay:0.2s; }
  .fade-up.d3 { transition-delay:0.3s; }

  /* Form inputs */
  .fi {
    width:100%; padding:0.85rem 1rem;
    background:${T.white}; border:1.5px solid ${T.stone};
    border-radius:8px; color:${T.ink};
    font-family:'DM Sans',sans-serif; font-size:0.95rem;
    outline:none; transition:border-color 0.22s, box-shadow 0.22s;
    -webkit-appearance:none; appearance:none;
  }
  .fi:focus { border-color:${T.cobalt}; box-shadow:0 0 0 3px rgba(26,79,214,0.1); }
  .fi::placeholder { color:${T.stoneMd}; }
  .fi.error { border-color:#d94040; box-shadow:0 0 0 3px rgba(217,64,64,0.1); }

  select.fi { cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7A8D' stroke-width='2'%3E%3Cpolyline points='6,9 12,15 18,9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 0.75rem center; background-size:16px; padding-right:2.5rem; }

  textarea.fi { resize:vertical; min-height:100px; }

  /* Error messages */
  .field-error { font-size:0.78rem; color:#d94040; margin-top:0.35rem; display:block; }

  /* Buttons */
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; font-family:'DM Sans',sans-serif; font-weight:600; letter-spacing:0.04em; border:none; cursor:pointer; transition:all 0.22s cubic-bezier(.22,.8,.36,1); border-radius:8px; text-transform:uppercase; font-size:0.78rem; }
  .btn:focus-visible { outline:3px solid ${T.cobalt}; outline-offset:2px; }
  .btn-primary { background:${T.cobalt}; color:#fff; padding:0.9rem 1.6rem; }
  .btn-primary:hover { background:${T.cobaltLt}; transform:translateY(-1px); box-shadow:0 6px 20px rgba(26,79,214,0.28); }
  .btn-outline { background:transparent; color:${T.ink}; padding:0.9rem 1.6rem; border:1.5px solid ${T.stone}; }
  .btn-outline:hover { border-color:${T.inkMd}; background:rgba(0,0,0,0.04); }
  .btn-navy { background:${T.navy}; color:#fff; padding:0.9rem 1.6rem; }
  .btn-navy:hover { background:${T.navyMd}; transform:translateY(-1px); }
  .btn-full { width:100%; }

  /* Accordion */
  .acc-item { border-bottom:1.5px solid ${T.stone}; }
  .acc-trigger { width:100%; background:none; border:none; cursor:pointer; padding:1.1rem 0; display:flex; align-items:center; justify-content:space-between; text-align:left; font-family:'DM Sans',sans-serif; font-size:0.95rem; font-weight:600; color:${T.ink}; transition:color 0.18s; }
  .acc-trigger:focus-visible { outline:2px solid ${T.cobalt}; outline-offset:2px; border-radius:2px; }
  .acc-trigger:hover { color:${T.cobalt}; }
  .acc-icon { flex-shrink:0; width:22px; height:22px; border-radius:50%; border:1.5px solid ${T.stone}; display:flex; align-items:center; justify-content:center; font-size:0.75rem; transition:all 0.22s; user-select:none; }
  .acc-icon.open { background:${T.cobalt}; border-color:${T.cobalt}; color:#fff; transform:rotate(45deg); }
  /* Accordion body uses auto height via JS measurement — no maxHeight clipping */
  .acc-body { overflow:hidden; transition:height 0.35s cubic-bezier(.22,.8,.36,1), opacity 0.3s; }
  .acc-body-inner { padding:0 0 1.2rem 0; font-size:0.9rem; color:${T.inkMd}; line-height:1.75; }

  /* Comparison cards */
  .cmp-bad  { background:${T.ivoryDk}; border:1.5px solid ${T.stone}; border-radius:12px; padding:1.5rem; }
  .cmp-good { background:${T.navy}; border:1.5px solid ${T.navy}; border-radius:12px; padding:1.5rem; color:#fff; }

  /* Nav */
  .nav-link { background:none; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:500; color:${T.inkMd}; letter-spacing:0.04em; padding:0.35rem 0; transition:color 0.18s; }
  .nav-link:focus-visible { outline:2px solid ${T.cobalt}; outline-offset:2px; border-radius:2px; }
  .nav-link:hover, .nav-link.active { color:${T.cobalt}; }

  /* Step form */
  .step-dot { width:8px; height:8px; border-radius:50%; transition:all 0.25s; }
  .step-dot.done { background:${T.cobalt}; }
  .step-dot.curr { background:${T.cobalt}; width:20px; border-radius:4px; }
  .step-dot.todo { background:${T.stone}; }

  /* Chip options */
  .chip { border:1.5px solid ${T.stone}; border-radius:20px; padding:0.5rem 1rem; font-size:0.82rem; font-weight:500; color:${T.inkMd}; cursor:pointer; transition:all 0.18s; background:${T.white}; }
  .chip:focus-visible { outline:2px solid ${T.cobalt}; outline-offset:2px; }
  .chip.selected { background:${T.cobalt}; border-color:${T.cobalt}; color:#fff; }
  .chip:hover:not(.selected) { border-color:${T.cobalt}; color:${T.cobalt}; }

  /* Report item */
  .report-item { display:flex; align-items:center; gap:0.9rem; padding:1rem 0; border-bottom:1px solid ${T.stone}; }
  .report-item:last-child { border-bottom:none; }

  /* Scrollbar */
  ::-webkit-scrollbar { width:6px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:${T.stone}; border-radius:4px; }

  /* Responsive helpers */
  @media (max-width:640px) {
    .hide-mobile { display:none !important; }
    .stack-mobile { flex-direction:column !important; }
    .full-mobile { width:100% !important; }
    /* 2-col grids collapse to 1 col on mobile */
    .grid-2col { grid-template-columns:1fr !important; }
  }
`;

/* --- Shared style objects (hoisted to prevent per-render recreation) ---------- */
const FL: CSSProperties = {
  fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: T.inkLt,
  display: "block",
  marginBottom: "0.5rem",
};

const SECTION_INNER: CSSProperties = {
  maxWidth: 680,
  margin: "0 auto",
  padding: "0 1.25rem",
};

/* --- Types -------------------------------------------------------------------- */
interface AccordionItem {
  q: string;
  a: string;
}

interface NavItem {
  l: string;
  p: string;
}

interface BrandsFormData {
  ciudad: string;
  zonas: string;
  presupuesto: string;
  objetivo: string[];
  problema: string[];
  empresa: string;
  whatsapp: string;
  email: string;
  notas: string;
}

interface DriversFormData {
  ciudad: string;
  zonas: string;
  km: string;
  vehiculo: string;
  premium: boolean;
  nombre: string;
  whatsapp: string;
  email: string;
  notas: string;
}

type Page = "home" | "brands" | "drivers" | "why";

/* --- Hooks -------------------------------------------------------------------- */

/**
 * Fires once when the element enters the viewport, then disconnects.
 * Generic element type avoids the RefObject<HTMLElement> mismatch on section/div.
 */
function useInView<T extends Element>(threshold = 0.1): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // disconnect after first fire — prevents memory leak
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* --- Accordion ---------------------------------------------------------------- */
/**
 * Uses measured pixel height instead of a fixed maxHeight cap,
 * so content never clips regardless of length.
 */
function AccordionPanel({ item, isOpen, onToggle, index }: {
  item: AccordionItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!innerRef.current) return;
    if (isOpen) {
      setHeight(innerRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  const panelId = `acc-panel-${index}`;
  const triggerId = `acc-trigger-${index}`;

  return (
    <div className="acc-item">
      <button
        id={triggerId}
        className="acc-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span>{item.q}</span>
        <span className={`acc-icon ${isOpen ? "open" : ""}`} aria-hidden="true">+</span>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="acc-body"
        style={{ height, opacity: isOpen ? 1 : 0 }}
      >
        <div ref={innerRef} className="acc-body-inner">{item.a}</div>
      </div>
    </div>
  );
}

function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const toggle = useCallback((i: number) => setOpen((prev) => (prev === i ? null : i)), []);

  return (
    <div>
      {items.map((item, i) => (
        <AccordionPanel
          key={i}
          item={item}
          isOpen={open === i}
          onToggle={() => toggle(i)}
          index={i}
        />
      ))}
    </div>
  );
}

/* --- Section wrapper ---------------------------------------------------------- */
function Section({
  children,
  style = {},
  bg = T.ivory,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  bg?: string;
  className?: string;
}) {
  const [ref, visible] = useInView<HTMLElement>();
  return (
    <section ref={ref} style={{ background: bg, ...style }} className={className}>
      <div className={`fade-up ${visible ? "visible" : ""}`} style={SECTION_INNER}>
        {children}
      </div>
    </section>
  );
}

/* --- Chip selector ------------------------------------------------------------ */
interface ChipsProps {
  options: string[];
  value: string | string[];
  onChange: (val: string | string[]) => void;
  multi?: boolean;
  label?: string; // for group aria-label
}

function Chips({ options, value, onChange, multi = false, label }: ChipsProps) {
  const toggle = useCallback(
    (o: string) => {
      if (multi) {
        const arr = Array.isArray(value) ? value : [];
        onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
      } else {
        onChange(o);
      }
    },
    [multi, value, onChange]
  );

  const isSelected = (o: string) =>
    multi ? Array.isArray(value) && value.includes(o) : value === o;

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, o: string) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle(o);
    }
  };

  return (
    <div
      role={multi ? "group" : "radiogroup"}
      aria-label={label}
      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}
    >
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role={multi ? "checkbox" : "radio"}
          aria-checked={isSelected(o)}
          className={`chip ${isSelected(o) ? "selected" : ""}`}
          onClick={() => toggle(o)}
          onKeyDown={(e) => handleKeyDown(e, o)}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/* --- Step indicator ----------------------------------------------------------- */
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Paso ${current + 1} de ${total}`}
      style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "1.5rem" }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`step-dot ${i < current ? "done" : i === current ? "curr" : "todo"}`}
        />
      ))}
      <span style={{ fontSize: "0.75rem", color: T.inkLt, marginLeft: 8 }} aria-hidden="true">
        {current + 1} / {total}
      </span>
    </div>
  );
}

/* --- Tag / Label chip --------------------------------------------------------- */
function Tag({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: T.cobaltBg,
        border: "1px solid rgba(26,79,214,0.18)",
        borderRadius: 20,
        padding: "0.3rem 0.85rem",
        fontFamily: "'DM Sans',sans-serif",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: T.cobalt,
      }}
    >
      {children}
    </div>
  );
}

/* --- Hero dot ----------------------------------------------------------------- */
function LiveDot() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: T.cobalt,
        animation: "pulse 2s infinite",
      }}
    />
  );
}

/* --- Reusable dark tag (for navy bg sections) --------------------------------- */
function DarkTag({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 20,
        padding: "0.3rem 0.85rem",
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(150,185,255,0.9)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {children}
    </div>
  );
}

/* --- Report list (shared between Home and Brands) ----------------------------- */
const REPORT_ITEMS = [
  { icon: "📍", label: "Kilómetros activos",                  desc: "Distancia total recorrida durante la campaña" },
  { icon: "🗺",  label: "Zonas recorridas",                   desc: "Barrios y sectores cubiertos por la flota" },
  { icon: "📱", label: "Escaneos QR",                         desc: "Interacciones directas con tu código QR" },
  { icon: "💬", label: "Conversaciones WhatsApp",             desc: "Contactos iniciados a través de campaña" },
  { icon: "📷", label: "Fotografías de verificación",         desc: "Evidencia visual de la instalación activa" },
  { icon: "📊", label: "Resumen semanal",                     desc: "Informe consolidado de cada semana de campaña" },
];

function ReportList({ showDesc = false }: { showDesc?: boolean }) {
  return (
    <div
      style={{
        background: T.ivoryDk,
        borderRadius: 16,
        border: `1.5px solid ${T.stone}`,
        overflow: "hidden",
      }}
    >
      {REPORT_ITEMS.map((r, i) => (
        <div
          key={r.label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: showDesc ? "0.9rem" : "0.85rem",
            padding: showDesc ? "1rem 1.25rem" : "0.85rem 1.25rem",
            borderBottom: i < REPORT_ITEMS.length - 1 ? `1px solid ${T.stone}` : "none",
          }}
        >
          <div style={{ fontSize: "1.1rem", flexShrink: 0 }} aria-hidden="true">{r.icon}</div>
          <div>
            <div style={{ fontWeight: showDesc ? 600 : 500, fontSize: "0.88rem", color: T.ink }}>{r.label}</div>
            {showDesc && (
              <div style={{ fontSize: "0.8rem", color: T.inkLt, marginTop: "0.1rem" }}>{r.desc}</div>
            )}
          </div>
          {!showDesc && (
            <div
              aria-hidden="true"
              style={{
                marginLeft: "auto",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: T.cobalt,
                opacity: 0.6,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* --- Navbar ------------------------------------------------------------------- */
const NAV_ITEMS: NavItem[] = [
  { l: "Inicio",       p: "home" },
  { l: "Marcas",      p: "brands" },
  { l: "Conductores", p: "drivers" },
  { l: "Por Qué Ahora", p: "why" },
];

interface NavbarProps {
  page: string;
  setPage: (p: string) => void;
  scrolled: boolean;
}

function Navbar({ page, setPage, scrolled }: NavbarProps) {
  const [mobOpen, setMobOpen] = useState(false);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.classList.toggle("nav-open", mobOpen);
    return () => document.body.classList.remove("nav-open");
  }, [mobOpen]);

  const navigate = (p: string) => {
    setPage(p);
    setMobOpen(false);
  };

  // Close on Escape key
  useEffect(() => {
    if (!mobOpen) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setMobOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
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
          onClick={() => setPage("home")}
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
              className={`nav-link ${page === x.p ? "active" : ""}`}
              onClick={() => setPage(x.p)}
              aria-current={page === x.p ? "page" : undefined}
            >
              {x.l}
            </button>
          ))}
          <button
            className="btn btn-primary"
            style={{ padding: "0.55rem 1.1rem" }}
            onClick={() => setPage("brands")}
          >
            Anunciar
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobOpen(!mobOpen)}
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
            <div key={i} style={{ width: 22, height: 2, background: T.ink, borderRadius: 2 }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobOpen && (
        <div
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
              className="btn btn-primary btn-full"
              onClick={() => navigate("brands")}
            >
              Anunciar mi marca
            </button>
            <button
              className="btn btn-outline btn-full"
              onClick={() => navigate("drivers")}
            >
              Conducir con Escanea
            </button>
          </div>
        </div>
      )}

      <style>{`
        .hide-desktop { display:none; }
        @media(max-width:640px){
          .hide-desktop{ display:flex !important; }
          .hide-mobile{ display:none !important; }
          #mob-btn{ display:flex !important; }
        }
      `}</style>
    </>
  );
}

/* --- Footer ------------------------------------------------------------------- */
function Footer({ setPage }: { setPage: (p: string) => void }) {
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
                  onClick={() => setPage(p)}
                  style={{
                    display: "block",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.55)",
                    marginBottom: "0.6rem",
                    textAlign: "left",
                    transition: "color 0.18s",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget).style.color = "#fff")}
                  onMouseLeave={(e) => ((e.currentTarget).style.color = "rgba(255,255,255,0.55)")}
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

function HomePage({ setPage }: { setPage: (p: string) => void }) {
  const [r1, v1] = useInView<HTMLElement>();
  const [r2, v2] = useInView<HTMLElement>();
  const [r3, v3] = useInView<HTMLElement>();
  const [r4, v4] = useInView<HTMLElement>();
  const [r5, v5] = useInView<HTMLElement>();

  return (
    <div style={{ background: T.ivory }}>
      <style>{GLOBAL}</style>

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
   FORM VALIDATION
=============================================================================== */

/** Returns an error message string or null if valid. */
function validateBrandsStep(step: number, fd: BrandsFormData): string | null {
  switch (step) {
    case 0: return fd.ciudad ? null : "Por favor selecciona tu ciudad.";
    case 1: return fd.zonas.trim() ? null : "Por favor indica al menos una zona.";
    case 2: return null; // presupuesto optional
    case 3: return null; // objetivo optional
    case 4: return null; // problema optional
    case 5: {
      if (!fd.empresa.trim()) return "Por favor ingresa el nombre de tu empresa.";
      if (!fd.whatsapp.trim()) return "Por favor ingresa tu número de WhatsApp.";
      if (!fd.email.trim() || !/\S+@\S+\.\S+/.test(fd.email)) return "Por favor ingresa un email válido.";
      return null;
    }
    case 6: return null; // notas optional
    default: return null;
  }
}

function validateDriversStep(step: number, fd: DriversFormData): string | null {
  switch (step) {
    case 0: return fd.ciudad ? null : "Por favor selecciona tu ciudad.";
    case 1: return fd.zonas.trim() ? null : "Por favor indica al menos una zona.";
    case 2: return null;
    case 3: return fd.vehiculo.trim() ? null : "Por favor ingresa los datos de tu vehículo.";
    case 4: return null;
    case 5: {
      if (!fd.nombre.trim()) return "Por favor ingresa tu nombre.";
      if (!fd.whatsapp.trim()) return "Por favor ingresa tu número de WhatsApp.";
      if (!fd.email.trim() || !/\S+@\S+\.\S+/.test(fd.email)) return "Por favor ingresa un email válido.";
      return null;
    }
    case 6: return null;
    default: return null;
  }
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

function BrandsPage({ setPage }: { setPage: (p: string) => void }) {
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
      <style>{GLOBAL}</style>

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

/* --- Shared success card ------------------------------------------------------ */
function SuccessCard({ title, message, bg = T.ivoryDk }: { title: string; message: string; bg?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: bg,
        border: `1.5px solid ${T.stone}`,
        borderRadius: 16,
        padding: "3rem",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }} aria-hidden="true">✓</div>
      <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.5rem", color: T.ink, marginBottom: "0.5rem" }}>
        {title}
      </h3>
      <p style={{ color: T.inkMd, fontSize: "0.9rem" }}>{message}</p>
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

function DriversPage({ setPage }: { setPage: (p: string) => void }) {
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
      <style>{GLOBAL}</style>

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

function WhyPage({ setPage }: { setPage: (p: string) => void }) {
  const [r1, v1] = useInView<HTMLElement>();
  const [r2, v2] = useInView<HTMLElement>();

  return (
    <div style={{ background: T.ivory }}>
      <style>{GLOBAL}</style>

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

  const changePage = useCallback((p: string) => {
    setPage(p as Page);
    // Use instant scroll on iOS Safari where smooth scroll can stutter during re-render
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