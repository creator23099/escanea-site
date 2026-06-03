"use client";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { Accordion } from "@/components/primitives/Accordion";
import { DarkTag } from "@/components/primitives/DarkTag";
import { Tag } from "@/components/primitives/Tag";
import { T } from "@/lib/tokens";
import type { AccordionItem } from "@/lib/types";
import { useInView } from "@/lib/use-in-view";

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
  ["Atribución QR",         "Cada vehículo incluye seguimiento QR único para medir interacciones reales."],
  ["Reportes verificables", "Datos reales de campaña: no estimaciones, no proyecciones."],
] as const;

export function WhyContent() {
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
            <Link href={ROUTES.marcas} scroll={false} className="btn btn-primary">Anunciar mi marca</Link>
            <Link href={ROUTES.conductores} scroll={false} className="btn btn-outline">Conducir con Escanea</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
