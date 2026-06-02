"use client";
import { useCallback, useState, type CSSProperties, type ReactNode } from "react";
import { Accordion } from "@/components/primitives/Accordion";
import { Chips } from "@/components/primitives/Chips";
import { ReportList } from "@/components/primitives/ReportList";
import { StepBar } from "@/components/primitives/StepBar";
import { SuccessCard } from "@/components/primitives/SuccessCard";
import { Tag } from "@/components/primitives/Tag";
import { T, FL } from "@/lib/tokens";
import type { AccordionItem, BrandsFormData } from "@/lib/types";
import { useInView } from "@/lib/use-in-view";
import { validateBrandsStep } from "@/lib/validation";

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
    a: "Las campañas van generalmente de 1 a 3 meses. Sin contratos largos ni permanencia obligatoria.",
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
  { n: "02", t: "Instalamos en flota activa", d: "Diseños profesionales en vehículos verificados que circulan todos los días." },
  { n: "03", t: "Tu marca circula con QR único", d: "Cada vehículo lleva un código QR para medir interacción y alcance en tiempo real." },
  { n: "04", t: "Recibes reportes semanales verificables", d: "Kilómetros, zonas, escaneos y conversaciones — datos reales cada semana." },
] as const;

const BRANDS_STEP_LABELS = ["Ciudad", "Zonas", "Presupuesto", "Objetivo", "Problema", "Contacto", "Comentarios"];

const MARCAS_HERO_BG_IMAGE = "/images/marcas-hero.jpg";
const MARCAS_HERO_BG_IMAGE_MOBILE = "/images/marcas-hero-vertical.jpg";

const MARCAS_HERO_GRADIENT =
  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.15) 100%)";

const FRAUD_PROTECTION_ITEMS = [
  {
    label: "Check-ins fotográficos",
    desc: "Evidencia visual durante la instalación y el ciclo activo de campaña.",
  },
  {
    label: "Conductores verificados",
    desc: "Trabajamos con conductores evaluados antes de asignarlos a una campaña.",
  },
  {
    label: "Verificación de campaña",
    desc: "Confirmamos que la campaña esté instalada y visible según lo acordado.",
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

const INITIAL_BRANDS: BrandsFormData = {
  ciudad: "", zonas: "", presupuesto: "", objetivo: [],
  problema: [], empresa: "", whatsapp: "", email: "",
  instagram: "", comments: "",
};

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
  const [problemRef, problemVis] = useInView<HTMLElement>();
  const [stepsRef, stepsVis] = useInView<HTMLElement>();
  const [safetyRef, safetyVis] = useInView<HTMLElement>();
  const [foundingRef, foundingVis] = useInView<HTMLElement>();
  const [reportRef, reportVis] = useInView<HTMLElement>();
  const [fraudRef, fraudVis] = useInView<HTMLElement>();
  const [faqRef, faqVis] = useInView<HTMLElement>();
  const [formRef, formVis] = useInView<HTMLElement>();
  const [step, setStep] = useState(0);
  const [fd, setFd] = useState<BrandsFormData>(INITIAL_BRANDS);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const prev = () => { setError(null); setSubmitError(null); setStep((s) => s - 1); };

  const submit = async () => {
    const err = validateBrandsStep(step, fd);
    if (err) { setError(err); return; }
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fd),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !body?.ok) {
        setSubmitError(body?.error || "No se pudo enviar la solicitud. Intenta nuevamente.");
        return;
      }
      setSent(true);
    } catch {
      setSubmitError("Error de conexión. Verifica tu internet e intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
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
      <div>
        <label htmlFor="b-instagram" style={FL}>Instagram</label>
        <input id="b-instagram" className="fi" type="text" value={fd.instagram} onChange={upd("instagram")} placeholder="@tuempresa" autoCapitalize="none" autoCorrect="off" spellCheck={false} inputMode="text" />
      </div>
    </div>,
    <div key={6}>
      <label htmlFor="b-comments" style={FL}>Comentarios</label>
      <textarea id="b-comments" className="fi" rows={4} value={fd.comments} onChange={upd("comments")} placeholder="Cuéntanos sobre tu campaña, objetivos, zonas de interés o cualquier detalle importante…" />
    </div>,
  ];

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
        <picture
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <source media="(max-width: 768px)" srcSet={MARCAS_HERO_BG_IMAGE_MOBILE} />
          <img
            src={MARCAS_HERO_BG_IMAGE}
            alt="Vehículo con publicidad de marca circulando por la ciudad"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
            }}
          />
        </picture>
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => document.getElementById("brands-form")?.scrollIntoView({ behavior: "smooth" })}
              >
                Activar campaña →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section ref={problemRef} style={sectionIvory} aria-label="El problema">
        <div className={`fade-up ${problemVis ? "visible" : ""}`} style={inner}>
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
        </div>
      </section>

      <section ref={stepsRef} style={sectionWhite} aria-label="Cómo funciona una campaña">
        <div className={`fade-up ${stepsVis ? "visible" : ""}`} style={inner}>
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
        </div>
      </section>

      <section ref={safetyRef} style={sectionIvory} aria-label="Seguridad de marca">
        <div className={`fade-up ${safetyVis ? "visible" : ""}`} style={inner}>
          <Tag>Curación</Tag>
          <h2 style={{ ...h2Brands, marginBottom: "1rem" }}>Tu marca, en buenas manos.</h2>
          <p style={{ ...bodyMd, margin: 0 }}>
            Trabajamos solo con conductores verificados y campañas de marcas profesionales. No aceptamos alcohol, tabaco, apuestas ni contenido que comprometa tu imagen.
          </p>
        </div>
      </section>

      <section ref={foundingRef} style={sectionWhite} aria-label="Marcas fundadoras">
        <div className={`fade-up ${foundingVis ? "visible" : ""}`} style={inner}>
          <Tag>Oportunidad</Tag>
          <h2 style={{ ...h2Brands, marginBottom: "1rem" }}>Marcas fundadoras.</h2>
          <p style={{ ...bodyMd, margin: 0 }}>
            Cupos limitados para las primeras marcas en Medellín y Bogotá. Las marcas fundadoras tienen prioridad y condiciones preferenciales para campañas futuras.
          </p>
        </div>
      </section>

      <section ref={reportRef} style={sectionIvory} aria-label="Reportes semanales">
        <div className={`fade-up ${reportVis ? "visible" : ""}`} style={inner}>
          <Tag>Reportes reales. No estimaciones.</Tag>
          <h2 style={{ ...h2Brands, marginBottom: "1.5rem" }}>Lo que recibes cada semana.</h2>
          <ReportList />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => document.getElementById("brands-form")?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontSize: "0.78rem" }}
            >
              Activar campaña →
            </button>
          </div>
        </div>
      </section>

      <section ref={fraudRef} style={sectionWhite} aria-label="Protección contra fraude">
        <div className={`fade-up ${fraudVis ? "visible" : ""}`} style={inner}>
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
        </div>
      </section>

      <section ref={faqRef} style={sectionIvory} aria-label="Preguntas frecuentes">
        <div className={`fade-up ${faqVis ? "visible" : ""}`} style={inner}>
          <Tag>FAQ</Tag>
          <h2 style={{ ...h2Brands, marginBottom: "1.25rem" }}>Preguntas frecuentes.</h2>
          <div style={faqPanelShell}>
            <Accordion items={BRANDS_FAQ} />
          </div>
        </div>
      </section>

      <section ref={formRef} id="brands-form" style={sectionIvory}>
        <div className={`fade-up ${formVis ? "visible" : ""}`} style={inner}>
          <Tag>Formulario</Tag>
          <h2 style={{ ...h2Brands, marginBottom: "1rem" }}>Activa tu campaña</h2>
          <p style={{ ...bodyMd, marginTop: 0, marginBottom: "2rem" }}>
            Campañas diseñadas a la medida de tu objetivo y presupuesto. Cuéntanos qué buscas y te armamos una propuesta en menos de 24 horas.
          </p>

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
              {submitError && <p className="field-error" role="alert">{submitError}</p>}
              <div style={{ display: "flex", gap: "0.65rem", justifyContent: "space-between", marginTop: "1rem" }}>
                {step > 0 && (
                  <button type="button" className="btn btn-outline" onClick={prev} disabled={submitting} style={{ fontSize: "0.78rem" }}>
                    ← Anterior
                  </button>
                )}
                <div style={{ marginLeft: "auto" }}>
                  {step < TOTAL - 1 ? (
                    <button type="button" className="btn btn-primary" onClick={next} disabled={submitting} style={{ fontSize: "0.78rem" }}>
                      Siguiente →
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={submit}
                      disabled={submitting}
                      aria-busy={submitting}
                      style={{ fontSize: "0.78rem" }}
                    >
                      {submitting ? "Enviando…" : "Enviar solicitud →"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
