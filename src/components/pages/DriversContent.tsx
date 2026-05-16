"use client";
import { useCallback, useState, type CSSProperties, type ReactNode } from "react";
import { Accordion } from "@/components/primitives/Accordion";
import { StepBar } from "@/components/primitives/StepBar";
import { SuccessCard } from "@/components/primitives/SuccessCard";
import { Tag } from "@/components/primitives/Tag";
import { T, FL } from "@/lib/tokens";
import type { AccordionItem, DriversFormData } from "@/lib/types";
import { useInView } from "@/lib/use-in-view";
import { validateDriversStep } from "@/lib/validation";

const DRIVER_SPEC_FAQ: AccordionItem[] = [
  {
    q: "¿Daña la pintura o los vidrios?",
    a: "No. Los materiales son de calidad profesional, removibles sin residuo. Se retiran con un proceso especializado que no compromete la pintura ni los vidrios originales.",
  },
  {
    q: "¿Es difícil de quitar?",
    a: "No tienes que quitarlo tú. Al finalizar la campaña, nuestro equipo coordina el retiro profesional sin costo adicional.",
  },
  {
    q: "¿Tengo que cambiar mis rutas o mis horarios?",
    a: "No. ESCANEA funciona junto a tu rutina habitual. No hay rutas obligatorias ni horarios fijos.",
  },
  {
    q: "¿Cuándo me pagan?",
    a: "Mensualmente, por transferencia bancaria, en fechas establecidas desde el inicio de la campaña.",
  },
  {
    q: "¿Cuánto tiempo dura una campaña?",
    a: "Entre 1 y 3 meses, dependiendo del cliente y la campaña activa. Al finalizar cada ciclo, tú decides si continúas.",
  },
  {
    q: "¿Puedo participar si tengo más de un vehículo?",
    a: "Sí. Si tienes una flota o conoces otros conductores activos, podemos coordinar postulaciones adicionales.",
  },
];

const DRIVERS_STEP_LABELS = ["Ciudad", "Zonas", "Kilómetros", "Vehículo", "Premium", "Contacto", "Notas"];

const INITIAL_DRIVERS: DriversFormData = {
  ciudad: "",
  zonas: "",
  km: "",
  vehiculo: "",
  premium: false,
  nombre: "",
  whatsapp: "",
  email: "",
  notas: "",
};

const inner: CSSProperties = {
  maxWidth: 680,
  margin: "0 auto",
};

const sectionIvory: CSSProperties = {
  background: T.ivory,
  padding: "3.5rem 1.25rem",
};

const bodyMd: CSSProperties = {
  fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.95rem",
  color: T.inkMd,
  lineHeight: 1.75,
};

const cardEyebrow: CSSProperties = {
  fontFamily: "'DM Sans',sans-serif",
  fontSize: "0.68rem",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: T.cobalt,
  marginBottom: "0.65rem",
};

const cardShell: CSSProperties = {
  background: T.white,
  border: `1.5px solid ${T.stone}`,
  borderRadius: 12,
  padding: "1.5rem",
};

const faqPanelShell: CSSProperties = {
  background: T.ivoryDk,
  borderRadius: 12,
  border: `1.5px solid ${T.stone}`,
  padding: "clamp(24px, 5vw, 32px)",
  overflow: "hidden",
};

const trustCardShell: CSSProperties = {
  background: T.ivoryDk,
  borderRadius: 8,
  padding: 24,
  border: `1px solid ${T.stone}`,
};

const whiteTrustCardShell: CSSProperties = {
  ...trustCardShell,
  background: T.white,
};

const darkTrustCardShell: CSSProperties = {
  ...trustCardShell,
  background: T.navy,
  borderColor: T.navy,
  color: T.white,
};

const MUTED_COBALT = "rgba(26,79,214,0.58)";

const CRITERIA_ITEMS = [
  "Vehículo particular en buen estado",
  "Mínimo 3 meses activo en Uber, DiDi o InDrive",
  "Recorridos consistentes en Bogotá o Medellín",
  "Sin daños mayores visibles en pintura o vidrios",
];

const INGRESOS_ITEMS = [
  "Sin costos iniciales",
  "Sin trabajo adicional",
  "Sin permanencia obligatoria más allá del ciclo",
];

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Postúlate",
    body: (
      <>
        Cuéntanos sobre tu vehículo y tu ciudad.
        <br />
        Te respondemos en menos de 48 horas.
      </>
    ),
  },
  {
    num: "02",
    title: "Recibe tu campaña",
    body: (
      <>
        Si calificas, te asignamos una campaña disponible
        <br />y coordinamos la instalación.
      </>
    ),
  },
  {
    num: "03",
    title: "Conduce y genera ingresos",
    body: (
      <>
        Maneja como siempre. El pago se deposita
        <br />
        mensualmente a tu cuenta bancaria.
      </>
    ),
  },
] as const;

function BrandedStackList({ items, background = T.ivoryDk }: { items: string[]; background?: string }) {
  return (
    <div
      style={{
        background,
        borderRadius: 12,
        border: `1.5px solid ${T.stone}`,
        overflow: "hidden",
      }}
    >
      {items.map((text, i) => (
        <div
          key={text}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            padding: "1rem 1.25rem",
            borderBottom: i < items.length - 1 ? `1px solid ${T.stone}` : "none",
          }}
        >
          <div
            aria-hidden
            style={{
              flexShrink: 0,
              fontFamily: "'DM Serif Display',serif",
              fontSize: "1rem",
              color: T.cobalt,
              opacity: 0.55,
              lineHeight: 1,
              minWidth: "1.4rem",
              paddingTop: 2,
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </div>
          <div style={{ ...bodyMd, margin: 0 }}>{text}</div>
        </div>
      ))}
    </div>
  );
}

function DarkTrustAccentTitle({ children }: { children: ReactNode }) {
  return (
    <>
      <div style={{ width: 24, height: 2, background: T.cobaltLt, marginBottom: 12 }} aria-hidden />
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: "0.82rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(150,185,255,0.85)",
          marginBottom: "0.65rem",
        }}
      >
        {children}
      </div>
    </>
  );
}

function ItalicClosing({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'DM Serif Display',serif",
        fontSize: "1.08rem",
        fontStyle: "italic",
        fontWeight: 400,
        color: MUTED_COBALT,
        marginTop: 32,
        lineHeight: 1.6,
      }}
    >
      {children}
    </p>
  );
}

function CenteredApplyButton() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => document.getElementById("drivers-form")?.scrollIntoView({ behavior: "smooth" })}
        style={{ fontSize: "0.78rem" }}
      >
        Postularme →
      </button>
    </div>
  );
}

export function DriversContent() {
  const [cardsRef, cardsVis] = useInView<HTMLElement>();
  const [stepsRef, stepsVis] = useInView<HTMLElement>();
  const [whoRef, whoVis] = useInView<HTMLElement>();
  const [vehRef, vehVis] = useInView<HTMLElement>();
  const [pasRef, pasVis] = useInView<HTMLElement>();
  const [ingRef, ingVis] = useInView<HTMLElement>();
  const [exitRef, exitVis] = useInView<HTMLElement>();
  const [faqRef, faqVis] = useInView<HTMLElement>();
  const [formRef, formVis] = useInView<HTMLElement>();
  const [step, setStep] = useState(0);
  const [fd, setFd] = useState<DriversFormData>(INITIAL_DRIVERS);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const TOTAL = DRIVERS_STEP_LABELS.length;

  const trustBody: CSSProperties = {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.92rem",
    color: T.inkMd,
    lineHeight: 1.75,
  };

  const darkTrustBody: CSSProperties = {
    ...trustBody,
    color: "rgba(255,255,255,0.72)",
  };

  const h2Drivers: CSSProperties = {
    fontFamily: "'DM Serif Display',serif",
    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
    color: T.ink,
    lineHeight: 1.2,
    margin: "1rem 0 1.75rem",
  };

  const upd = useCallback(
    (k: keyof DriversFormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFd((f) => ({ ...f, [k]: e.target.value as never }));
        setError(null);
      },
    []
  );

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
    const err = validateDriversStep(step, fd);
    if (err) {
      setError(err);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/contact/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fd),
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
          background: `linear-gradient(160deg, ${T.white} 0%, ${T.ivory} 100%)`,
          padding: "100px 1.25rem 3rem",
          overflow: "visible",
        }}
      >
        <div style={inner}>
          <div style={{ animation: "fadeIn 0.6s ease 0.1s both", marginBottom: "1.2rem" }}>
            <Tag>Para Conductores</Tag>
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
            Una nueva red de medios urbanos.
            <br />
            <em style={{ color: T.cobalt }}>Para conductores seleccionados.</em>
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "1rem",
              color: T.inkMd,
              lineHeight: 1.75,
              maxWidth: 480,
              marginBottom: "2rem",
              animation: "fadeUp 0.7s ease 0.38s both",
            }}
          >
            Genera ingresos adicionales con los recorridos que ya haces.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => document.getElementById("drivers-form")?.scrollIntoView({ behavior: "smooth" })}
            style={{ animation: "fadeUp 0.7s ease 0.5s both" }}
          >
            Postularme →
          </button>
        </div>
      </section>

      <section ref={cardsRef} style={sectionIvory} aria-label="En qué consiste">
        <div className={`fade-up ${cardsVis ? "visible" : ""}`} style={inner}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <article style={cardShell}>
              <div style={cardEyebrow}>01 · EL VEHÍCULO</div>
              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.35rem", color: T.ink, marginBottom: "0.65rem" }}>Vehículo seguro</h3>
              <p style={bodyMd}>Materiales de calidad profesional, removibles y seguros para pintura y vidrios. Sin daño. Sin residuo permanente.</p>
            </article>
            <article style={cardShell}>
              <div style={cardEyebrow}>02 · LA RUTINA</div>
              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.35rem", color: T.ink, marginBottom: "0.65rem" }}>Tu ruta, sin cambios</h3>
              <p style={bodyMd}>Sin rutas obligatorias. Sin horarios fijos. Conduce exactamente como ya lo haces.</p>
            </article>
            <article style={cardShell}>
              <div style={cardEyebrow}>03 · EL PAGO</div>
              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.35rem", color: T.ink, marginBottom: "0.65rem" }}>Pagos transparentes</h3>
              <p style={bodyMd}>Cada campaña tiene un valor definido que conoces antes de aceptar. Transferencia bancaria mensual.</p>
            </article>
          </div>
        </div>
      </section>

      <section ref={stepsRef} style={sectionIvory} aria-label="Cómo funciona">
        <div className={`fade-up ${stepsVis ? "visible" : ""}`} style={inner}>
          <Tag>El proceso</Tag>
          <h2 style={{ ...h2Drivers, marginBottom: "2.5rem" }}>Tres pasos.</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {PROCESS_STEPS.map(({ num, title, body }) => (
              <div key={num} style={{ ...cardShell, display: "flex", flexDirection: "column", flex: "1 1 180px" }}>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1rem", color: T.cobalt, opacity: 0.55, lineHeight: 1, marginBottom: "0.85rem" }}>{num}</div>
                <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.35rem", color: T.ink, lineHeight: 1.2, marginBottom: "0.65rem" }}>{title}</h3>
                <p style={{ ...bodyMd, margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
          <CenteredApplyButton />
        </div>
      </section>

      <section ref={whoRef} style={sectionIvory} aria-label="Perfil">
        <div className={`fade-up ${whoVis ? "visible" : ""}`} style={inner}>
          <Tag>Requisitos</Tag>
          <h2 style={h2Drivers}>Trabajamos con conductores activos.</h2>
          <p style={{ ...bodyMd, marginTop: 0, marginBottom: "1.25rem" }}>Buscamos conductores con:</p>
          <BrandedStackList items={CRITERIA_ITEMS} background={T.white} />
          <ItalicClosing>No es una plataforma masiva. Es una red curada.</ItalicClosing>
        </div>
      </section>

      <section ref={vehRef} style={sectionIvory} aria-label="Cuidado del vehículo">
        <div className={`fade-up ${vehVis ? "visible" : ""}`} style={inner}>
          <Tag>Tu vehículo</Tag>
          <h2 style={h2Drivers}>Cuidamos tu vehículo como si fuera el nuestro.</h2>
          <p style={{ ...bodyMd, marginTop: 0, marginBottom: 48 }}>
            Usamos materiales de calidad profesional, los mismos estándares utilizados por flotas vehiculares en todo el mundo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={darkTrustCardShell}>
              <DarkTrustAccentTitle>REMOVIBLES SIN RESIDUO</DarkTrustAccentTitle>
              <p style={darkTrustBody}>Al finalizar la campaña, los materiales se retiran con un proceso profesional que no deja adhesivo ni marcas en la pintura ni en los vidrios originales.</p>
            </div>
            <div style={darkTrustCardShell}>
              <DarkTrustAccentTitle>INSTALACIÓN COORDINADA</DarkTrustAccentTitle>
              <p style={darkTrustBody}>Un equipo especializado realiza la instalación en menos de 30 minutos. No tienes que aprender nada técnico.</p>
            </div>
            <div style={darkTrustCardShell}>
              <DarkTrustAccentTitle>SIN MODIFICACIONES PERMANENTES</DarkTrustAccentTitle>
              <p style={darkTrustBody}>No se hacen agujeros, no se altera el vehículo, no se compromete tu reventa.</p>
            </div>
            <div style={darkTrustCardShell}>
              <DarkTrustAccentTitle>DOCUMENTACIÓN PREVIA</DarkTrustAccentTitle>
              <p style={darkTrustBody}>Antes de instalar, documentamos el estado del vehículo contigo presente.</p>
            </div>
          </div>
          <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.08rem", fontStyle: "italic", fontWeight: 400, color: MUTED_COBALT, marginTop: 48, lineHeight: 1.6 }}>
            Tu vehículo es tu herramienta de trabajo. Lo tratamos con el mismo respeto.
          </p>
          <CenteredApplyButton />
        </div>
      </section>

      <section ref={pasRef} style={sectionIvory} aria-label="Experiencia del pasajero">
        <div className={`fade-up ${pasVis ? "visible" : ""}`} style={inner}>
          <Tag>Tus pasajeros</Tag>
          <h2 style={h2Drivers}>Diseñado para no afectar la experiencia del pasajero.</h2>
          <div style={whiteTrustCardShell}>
            <div style={{ width: 24, height: 2, background: T.cobalt, marginBottom: 12 }} aria-hidden />
            <div style={{ display: "grid", gap: "0.85rem" }}>
              {[
                ["Apariencia profesional", "No son stickers llamativos ni publicidad tradicional."],
                ["Ubicación sin interferir", "Los materiales se ubican en zonas que no afectan la visibilidad ni la experiencia del pasajero."],
                ["Relación intacta", "Tu calificación, tus propinas y tu relación con los pasajeros se mantienen."],
              ].map(([title, desc]) => (
                <div key={title}>
                  <strong style={{ color: T.cobalt, display: "block", fontSize: "0.9rem", marginBottom: "0.2rem" }}>{title}</strong>
                  <p style={{ ...bodyMd, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={ingRef} style={sectionIvory} aria-label="Ingresos">
        <div className={`fade-up ${ingVis ? "visible" : ""}`} style={inner}>
          <Tag>Ingresos</Tag>
          <h2 style={h2Drivers}>Ingresos adicionales por los recorridos que ya haces.</h2>
          <p style={{ ...bodyMd, marginTop: 0 }}>
            Cada campaña tiene un pago definido antes de aceptar. Los pagos típicos están entre 200.000 y 400.000 COP mensuales, según la campaña, ciudad y vehículo.
          </p>
          <div style={{ marginTop: "1rem" }}>
            <BrandedStackList items={INGRESOS_ITEMS} background={T.white} />
          </div>
          <p style={{ ...bodyMd, marginTop: "1rem", fontFamily: "'DM Serif Display',serif", fontStyle: "italic", color: MUTED_COBALT }}>
            El pago se realiza mensualmente por transferencia bancaria.
          </p>
          <CenteredApplyButton />
        </div>
      </section>

      <section ref={exitRef} style={sectionIvory} aria-label="Flexibilidad">
        <div className={`fade-up ${exitVis ? "visible" : ""}`} style={inner}>
          <Tag>Flexibilidad</Tag>
          <h2 style={h2Drivers}>Compromiso por campaña, no a largo plazo.</h2>
          <p style={{ ...bodyMd, marginTop: 0 }}>Cada campaña tiene una duración definida — generalmente entre 1 y 3 meses. Al finalizar, tú decides:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ marginTop: 24 }}>
            {[
              ["Continuar", "con una nueva campaña."],
              ["Pausar", "tu participación temporalmente."],
              ["Terminar", "retiramos los materiales sin costo."],
            ].map(([title, desc]) => (
              <div key={title} style={whiteTrustCardShell}>
                <strong style={{ color: T.cobalt, display: "block", fontSize: "0.92rem", marginBottom: "0.35rem" }}>{title}</strong>
                <p style={{ ...bodyMd, fontSize: "0.86rem", margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
          <p style={{ ...bodyMd, fontSize: "0.88rem", marginTop: 32, fontFamily: "'DM Serif Display',serif", fontStyle: "italic", color: MUTED_COBALT }}>
            Sin permanencia obligatoria más allá del ciclo activo. Sin penalizaciones por terminar al final de una campaña.
          </p>
        </div>
      </section>

      <section ref={faqRef} style={sectionIvory} aria-label="Preguntas frecuentes">
        <div className={`fade-up ${faqVis ? "visible" : ""}`} style={inner}>
          <Tag>FAQ</Tag>
          <h2 style={{ ...h2Drivers, marginBottom: "1.25rem" }}>Preguntas frecuentes.</h2>
          <div style={faqPanelShell}>
            <Accordion items={DRIVER_SPEC_FAQ} />
          </div>
        </div>
      </section>

      <section ref={formRef} id="drivers-form" style={sectionIvory}>
        <div className={`fade-up ${formVis ? "visible" : ""}`} style={inner}>
          <div style={{ marginBottom: "1rem" }}>
            <Tag>Registro</Tag>
          </div>
          <h2 style={{ ...h2Drivers, margin: "1rem 0 2rem" }}>Postúlate a la red</h2>
          <p style={{ fontSize: "0.95rem", color: T.inkMd, lineHeight: 1.65, marginBottom: "1.75rem" }}>
            Si calificas, te contactamos en menos de 48 horas.
          </p>

          {sent ? (
            <SuccessCard title="Recibimos tu postulación." message="Te contactamos por WhatsApp en menos de 48 horas." bg={T.white} />
          ) : (
            <div
              style={{ background: T.white, border: `1.5px solid ${T.stone}`, borderRadius: 16, padding: "1.75rem" }}
              role="form"
              aria-label="Formulario de registro para conductores"
            >
              <StepBar current={step} total={TOTAL} />
              <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.inkLt, marginBottom: "1rem" }}>
                Paso {step + 1}: {DRIVERS_STEP_LABELS[step]}
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
        </div>
      </section>
    </div>
  );
}
