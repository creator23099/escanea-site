"use client";

import { useCallback, useState, type CSSProperties, type ReactNode } from "react";
import { FadeUpSection } from "@/components/primitives/FadeUpSection";
import { StepBar } from "@/components/primitives/StepBar";
import { SuccessCard } from "@/components/primitives/SuccessCard";
import { Tag } from "@/components/primitives/Tag";
import { T, FL } from "@/lib/tokens";
import {
  DRIVERS_STEP_LABELS,
  INITIAL_DRIVERS,
  KM_OPTIONS,
  ADVERTISING_WILLINGNESS_OPTIONS,
  driversPayloadForApi,
  zonesForCity,
} from "@/lib/drivers-form";
import type { DriversFormData } from "@/lib/types";
import { validateDriversStep } from "@/lib/validation";

const fieldHint: CSSProperties = {
  fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.82rem",
  color: T.inkMd,
  marginTop: "0.35rem",
  lineHeight: 1.5,
};

const zoneLabel: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "0.65rem",
  cursor: "pointer",
  fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.9rem",
  color: T.inkMd,
  lineHeight: 1.45,
};

const inner = { maxWidth: 680, margin: "0 auto" } as const;
const sectionIvory = { background: T.ivory, padding: "3.5rem 1.25rem" } as const;
const h2Drivers = {
  fontFamily: "'DM Serif Display',serif",
  fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
  color: T.ink,
  lineHeight: 1.2,
  margin: "1rem 0 1.75rem",
} as const;

export function DriversContactForm() {
  const [step, setStep] = useState(0);
  const [fd, setFd] = useState<DriversFormData>(INITIAL_DRIVERS);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const TOTAL = DRIVERS_STEP_LABELS.length;

  const upd = useCallback(
    (k: keyof DriversFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFd((f) => ({ ...f, [k]: e.target.value as never }));
        setError(null);
      },
    []
  );

  const setCiudad = (ciudad: string) => {
    setFd((f) => ({ ...f, ciudad, zonas: [], zonasOtra: "" }));
    setError(null);
  };

  const toggleZone = (zone: string) => {
    setFd((f) => {
      const selected = f.zonas.includes(zone);
      const zonas = selected ? f.zonas.filter((z) => z !== zone) : [...f.zonas, zone];
      const zonasOtra = zone === "Otra" && selected ? "" : f.zonasOtra;
      return { ...f, zonas, zonasOtra };
    });
    setError(null);
  };

  const next = () => {
    const err = validateDriversStep(step, fd);
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
    for (let i = 0; i < TOTAL - 1; i++) {
      const err = validateDriversStep(i, fd);
      if (err) {
        setError(err);
        setStep(i);
        return;
      }
    }
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driversPayloadForApi(fd)),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !body?.ok) {
        setSubmitError(body?.error || "No se pudo enviar el registro. Intenta nuevamente.");
        return;
      }
      setSent(true);
    } catch {
      setSubmitError("Error de conexión. Verifica tu internet e intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const zoneOptions = zonesForCity(fd.ciudad);

  const stepContent: ReactNode[] = [
    <div key={0}>
      <label htmlFor="d-ciudad" style={FL}>Ciudad principal donde manejas</label>
      <select
        id="d-ciudad"
        className={`fi ${error ? "error" : ""}`}
        value={fd.ciudad}
        onChange={(e) => setCiudad(e.target.value)}
        required
        aria-required="true"
      >
        <option value="">Selecciona tu ciudad</option>
        <option>Medellín</option>
        <option>Bogotá</option>
      </select>
    </div>,
    <div key={1}>
      <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
        <legend style={{ ...FL, padding: 0, marginBottom: 0 }}>Zonas que manejas con más frecuencia</legend>
        <div
          role="group"
          aria-label="Zonas que manejas con más frecuencia"
          style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginTop: "0.75rem" }}
        >
          {zoneOptions.map((zone) => (
            <label key={zone} style={zoneLabel}>
              <input
                type="checkbox"
                checked={fd.zonas.includes(zone)}
                onChange={() => toggleZone(zone)}
                style={{ marginTop: "0.2rem", flexShrink: 0, accentColor: T.cobalt }}
              />
              <span>{zone}</span>
            </label>
          ))}
        </div>
        {fd.zonas.includes("Otra") && (
          <input
            id="d-zonas-otra"
            className={`fi ${error ? "error" : ""}`}
            type="text"
            value={fd.zonasOtra}
            onChange={upd("zonasOtra")}
            placeholder="Especifica tu zona"
            style={{ marginTop: "0.75rem" }}
            aria-label="Especifica tu zona"
          />
        )}
      </fieldset>
    </div>,
    <div key={2}>
      <label htmlFor="d-km" style={FL}>Kilómetros promedio que manejas al mes</label>
      <select id="d-km" className={`fi ${error ? "error" : ""}`} value={fd.km} onChange={upd("km")} required aria-required="true">
        <option value="">Seleccionar</option>
        {KM_OPTIONS.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <p style={fieldHint}>Manejas tus rutas normales — no necesitas cambiar nada</p>
    </div>,
    <div key={3}>
      <label htmlFor="d-vehiculo" style={FL}>Vehículo: año, marca, modelo y color</label>
      <input
        id="d-vehiculo"
        className={`fi ${error ? "error" : ""}`}
        type="text"
        value={fd.vehiculo}
        onChange={upd("vehiculo")}
        placeholder="Ej: 2018 Chevrolet Spark, Blanco"
        required
        aria-required="true"
      />
    </div>,
    <div key={4} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ ...FL, marginBottom: "0.15rem" }}>Información de contacto</div>
      <div>
        <label htmlFor="d-nombre" style={FL}>Nombre completo</label>
        <input
          id="d-nombre"
          className={`fi ${error && !fd.nombre ? "error" : ""}`}
          type="text"
          value={fd.nombre}
          onChange={upd("nombre")}
          placeholder="Tu nombre"
          required
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="d-whatsapp" style={FL}>WhatsApp</label>
        <input
          id="d-whatsapp"
          className={`fi ${error && !fd.whatsapp ? "error" : ""}`}
          type="tel"
          value={fd.whatsapp}
          onChange={upd("whatsapp")}
          placeholder="+57 300 000 0000"
          required
          aria-required="true"
        />
      </div>
      <div>
        <label htmlFor="d-email" style={FL}>Email</label>
        <input
          id="d-email"
          className={`fi ${error && !fd.email ? "error" : ""}`}
          type="email"
          value={fd.email}
          onChange={upd("email")}
          placeholder="tu@correo.com"
          required
          aria-required="true"
        />
      </div>
    </div>,
    <div key={5}>
      <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
        <legend style={{ ...FL, padding: 0, marginBottom: 0 }}>
          ¿Estás dispuesto a llevar publicidad en tu vehículo para generar ingresos extra mensuales?
        </legend>
        <div
          role="radiogroup"
          aria-label="Disposición para llevar publicidad"
          style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginTop: "0.75rem" }}
        >
          {ADVERTISING_WILLINGNESS_OPTIONS.map((opt) => (
            <label key={opt} style={zoneLabel}>
              <input
                type="radio"
                name="d-dispuesto-publicidad"
                checked={fd.dispuestoPublicidad === opt}
                onChange={() => {
                  setFd((f) => ({ ...f, dispuestoPublicidad: opt }));
                  setError(null);
                }}
                style={{ marginTop: "0.25rem", flexShrink: 0, accentColor: T.cobalt }}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>,
    <div key={6}>
      <label htmlFor="d-notas" style={FL}>¿Algo más que quieras compartir?</label>
      <textarea
        id="d-notas"
        className="fi"
        rows={4}
        value={fd.notas}
        onChange={upd("notas")}
        placeholder="Cualquier información adicional, preguntas, o comentarios"
      />
    </div>,
  ];

  return (
      <FadeUpSection id="drivers-form" style={sectionIvory} innerStyle={inner}>
          <div style={{ marginBottom: "1rem" }}>
            <Tag>Registro</Tag>
          </div>
          <h2 style={{ ...h2Drivers, margin: "1rem 0 2rem" }}>Postúlate a la red</h2>
          <p style={{ fontSize: "0.95rem", color: T.inkMd, lineHeight: 1.65, marginBottom: "1.75rem" }}>
            Si calificas, te contactamos en menos de 48 horas.
          </p>

          {sent ? (
            <SuccessCard
              title="¡Gracias! Tu postulación está registrada."
              message="Te contactaremos cuando lancemos la próxima campaña en tu ciudad."
              bg={T.white}
            />
          ) : (
            <div
              style={{ background: T.white, border: `1.5px solid ${T.stone}`, borderRadius: 16, padding: "1.75rem" }}
              role="form"
              aria-label="Formulario de registro para conductores"
            >
              <StepBar current={step} total={TOTAL} />
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkLt, marginBottom: "1rem" }}>
                Paso {step + 1} de {TOTAL}: {DRIVERS_STEP_LABELS[step]}
              </div>
              <div style={{ minHeight: 120, marginBottom: "1rem" }}>{stepContent[step]}</div>
              {error && <p className="field-error" role="alert">{error}</p>}
              {submitError && <p className="field-error" role="alert">{submitError}</p>}
              <div style={{ display: "flex", gap: "0.65rem", justifyContent: "space-between", marginTop: "1rem", flexWrap: "wrap" }}>
                {step > 0 && (
                  <button type="button" className="btn btn-outline" onClick={prev} disabled={submitting} style={{ fontSize: "0.78rem" }}>← Anterior</button>
                )}
                <div style={{ marginLeft: "auto" }}>
                  {step < TOTAL - 1 ? (
                    <button type="button" className="btn btn-primary" onClick={next} disabled={submitting} style={{ fontSize: "0.78rem" }}>Siguiente →</button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={submit}
                      disabled={submitting}
                      aria-busy={submitting}
                      style={{ fontSize: "0.78rem" }}
                    >
                      {submitting ? "Enviando…" : "Enviar postulación"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
      </FadeUpSection>
  );
}
