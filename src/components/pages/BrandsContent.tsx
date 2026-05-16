"use client";
import { useCallback, useState, type ReactNode } from "react";
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

const BRANDS_STEP_LABELS = ["Ciudad", "Zonas", "Presupuesto", "Objetivo", "Problema", "Contacto", "Comentarios"];

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

export function BrandsContent() {
  const [r1, v1] = useInView<HTMLElement>();
  const [r2, v2] = useInView<HTMLElement>();
  const [r3, v3] = useInView<HTMLElement>();
  const [r4, v4] = useInView<HTMLElement>();
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
            type="button"
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

      <section ref={r3} style={{ background: T.ivory, padding: "3.5rem 1.25rem" }}>
        <div className={`fade-up ${v3 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
          <Tag>Verificación</Tag>
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: T.ink,
              lineHeight: 1.2,
              margin: "1rem 0 1.5rem",
            }}
          >
            Protección contra fraude.
          </h2>
          <p style={{ fontSize: "0.95rem", color: T.inkMd, lineHeight: 1.75, marginTop: 0, marginBottom: "1.25rem" }}>
            Cada campaña incluye controles para confirmar que la ejecución sea real, visible y monitoreada durante el ciclo activo.
          </p>
          <div
            style={{
              background: T.white,
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

      {/* Multi-step form */}
      <section ref={r4} id="brands-form" style={{ background: T.ivory, padding: "3.5rem 1.25rem" }}>
        <div className={`fade-up ${v4 ? "visible" : ""}`} style={{ maxWidth: 680, margin: "0 auto" }}>
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
