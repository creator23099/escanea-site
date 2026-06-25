"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Chips } from "@/components/primitives/Chips";
import { FadeUpSection } from "@/components/primitives/FadeUpSection";
import { StepBar } from "@/components/primitives/StepBar";
import { SuccessCard } from "@/components/primitives/SuccessCard";
import { Tag } from "@/components/primitives/Tag";
import { T, FL } from "@/lib/tokens";
import type { BrandsFormData } from "@/lib/types";
import { validateBrandsStep } from "@/lib/validation";

const BRANDS_STEP_LABELS = ["Ciudad", "Zonas", "Presupuesto", "Objetivo", "Problema", "Contacto", "Comentarios"];

const INITIAL_BRANDS: BrandsFormData = {
  ciudad: "",
  zonas: "",
  presupuesto: "",
  objetivo: [],
  problema: [],
  empresa: "",
  whatsapp: "",
  email: "",
  instagram: "",
  comments: "",
};

const MUTED_COBALT = "rgba(26,79,214,0.58)";

const inner = { maxWidth: 680, margin: "0 auto" } as const;

const sectionIvory = { background: T.ivory, padding: "3.5rem 1.25rem" } as const;

const bodyMd = {
  fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.95rem",
  color: T.inkMd,
  lineHeight: 1.75,
} as const;

const h2Brands = {
  fontFamily: "'DM Serif Display',serif",
  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
  color: T.ink,
  lineHeight: 1.2,
  margin: "1rem 0 1.75rem",
} as const;

const urgencyLine = {
  fontFamily: "'DM Serif Display',serif",
  fontSize: "0.88rem",
  fontStyle: "italic",
  fontWeight: 400,
  color: MUTED_COBALT,
  lineHeight: 1.6,
  margin: 0,
  textAlign: "center",
} as const;

export function BrandsContactForm() {
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
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => s + 1);
  };

  const prev = () => {
    setError(null);
    setSubmitError(null);
    setStep((s) => s - 1);
  };

  const submit = async () => {
    const err = validateBrandsStep(step, fd);
    if (err) {
      setError(err);
      return;
    }
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
    <FadeUpSection id="brands-form" style={sectionIvory} innerStyle={inner}>
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
          {step === TOTAL - 1 && (
            <p style={{ ...urgencyLine, marginTop: "1rem", marginBottom: "0.75rem" }}>
              Activa tu campaña en 14 días.
            </p>
          )}
          <div style={{ display: "flex", gap: "0.65rem", justifyContent: "space-between", marginTop: step === TOTAL - 1 ? 0 : "1rem" }}>
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
    </FadeUpSection>
  );
}
