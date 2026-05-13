"use client";
import { useCallback, useState, type ReactNode } from "react";
import { Accordion } from "@/components/primitives/Accordion";
import { DarkTag } from "@/components/primitives/DarkTag";
import { StepBar } from "@/components/primitives/StepBar";
import { SuccessCard } from "@/components/primitives/SuccessCard";
import { Tag } from "@/components/primitives/Tag";
import { T, FL } from "@/lib/tokens";
import type { AccordionItem, DriversFormData } from "@/lib/types";
import { useInView } from "@/lib/use-in-view";
import { validateDriversStep } from "@/lib/validation";

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

export function DriversContent() {
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
            type="button"
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
                  <button type="button" className="btn btn-outline" onClick={prev} style={{ fontSize: "0.78rem" }}>← Anterior</button>
                )}
                <div style={{ marginLeft: "auto" }}>
                  {step < TOTAL - 1 ? (
                    <button type="button" className="btn btn-navy" onClick={next} style={{ fontSize: "0.78rem" }}>Siguiente →</button>
                  ) : (
                    <button type="button" className="btn btn-navy" onClick={submit} style={{ fontSize: "0.78rem" }}>Enviar registro →</button>
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
